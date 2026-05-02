import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const REPO_OWNER = "hanibrahim130-boop";
const REPO_NAME = "bundlyplus-app";
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const IGNORE = new Set([
  "node_modules",
  ".git",
  "dist",
  ".cache",
  ".local",
  ".replit",
  "replit.nix",
  ".config",
  ".upm",
  "generated",
  ".canvas",
  ".breakpoints",
]);

const IGNORE_SUFFIXES = [".tsbuildinfo"];

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ghFetch(
  path: string,
  options: RequestInit = {},
  retries = 3
): Promise<any> {
  const url = path.startsWith("https://") ? path : `${API_BASE}${path}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        ...((options.headers as Record<string, string>) || {}),
      },
    });
    if (res.ok) return res.json();
    if (res.status === 403 || res.status === 429) {
      const wait = Math.pow(2, attempt + 1) * 5000;
      console.log(
        `  Rate limited, waiting ${wait / 1000}s (attempt ${attempt + 1}/${retries + 1})...`
      );
      await sleep(wait);
      continue;
    }
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  throw new Error("Exceeded max retries due to rate limiting");
}

function walk(dir: string, base = ""): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    if (IGNORE.has(e.name)) continue;
    if (
      e.name.startsWith(".") &&
      e.name !== ".gitignore" &&
      e.name !== ".npmrc"
    )
      continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...walk(full, rel));
    } else if (e.isFile()) {
      if (IGNORE_SUFFIXES.some((s) => e.name.endsWith(s))) continue;
      const stat = statSync(full);
      if (stat.size > 50 * 1024 * 1024) continue;
      files.push(rel);
    }
  }
  return files;
}

function isBinary(buffer: Buffer): boolean {
  for (let i = 0; i < Math.min(buffer.length, 8000); i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

async function main() {
  const rootDir = join(import.meta.dirname, "../..");
  const files = walk(rootDir);
  console.log(`Found ${files.length} files to push`);

  const ref = await ghFetch("/git/ref/heads/main");
  const latestCommitSha = ref.object.sha;
  console.log(`Latest commit: ${latestCommitSha}`);

  const BATCH_SIZE = 5;
  const treeItems: Array<{
    path: string;
    mode: string;
    type: string;
    sha: string;
  }> = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (filePath) => {
      const fullPath = join(rootDir, filePath);
      const content = readFileSync(fullPath);

      const blob = await ghFetch("/git/blobs", {
        method: "POST",
        body: JSON.stringify({
          content: content.toString("base64"),
          encoding: "base64",
        }),
      });

      return {
        path: filePath,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha as string,
      };
    });

    const results = await Promise.all(promises);
    treeItems.push(...results);
    console.log(
      `  Uploaded ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} files`
    );
    if (i + BATCH_SIZE < files.length) await sleep(500);
  }

  console.log("Creating tree...");
  const tree = await ghFetch("/git/trees", {
    method: "POST",
    body: JSON.stringify({ tree: treeItems }),
  });
  console.log(`Tree SHA: ${tree.sha}`);

  console.log("Creating commit...");
  const commit = await ghFetch("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message:
        "feat: BundlyPlus - Digital subscription marketplace\n\nFull-stack monorepo with React+Vite frontend, Express API, PostgreSQL+Drizzle ORM.\nFeatures: product catalog, bundles (Arabic RTL), cart, WhatsApp checkout, glassmorphism UI.",
      tree: tree.sha,
      parents: [latestCommitSha],
    }),
  });
  console.log(`Commit SHA: ${commit.sha}`);

  console.log("Updating ref...");
  await ghFetch("/git/refs/heads/main", {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
  });

  console.log(
    `\nDone! Code pushed to https://github.com/${REPO_OWNER}/${REPO_NAME}`
  );
}

main().catch((err) => {
  console.error("Push failed:", err);
  process.exit(1);
});
