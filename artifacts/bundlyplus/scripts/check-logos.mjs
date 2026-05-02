#!/usr/bin/env node
//
// check-logos
// -----------
// Scans products.json against public/logos/ and regenerates the logo manifest.
//
// Modes:
//   default  — print a warning if any product is missing a logo, exit 0.
//   strict   — exit 1 if any product is missing a logo. Used by `prebuild`
//              so production deploys cannot ship without all logos.
//   prune    — delete (or archive) orphan logo files that no product uses.
//
// Opt into strict mode either by:
//   - setting the env var `STRICT_LOGOS=1` (or `STRICT_LOGOS=true`), or
//   - passing the `--strict` flag on the command line.
//
// Opt into prune mode by passing `--prune` (delete) or `--prune=archive`
// (move to public/logos/_archive/). A confirmation prompt is shown unless
// `--yes` / `-y` is passed. Without `--prune` the script is read-only.
//
// The repo's `predev` script runs in default (warning) mode for a friendly
// local dev loop; `prebuild` runs in strict mode to gate releases.
//
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  renameSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOGOS_DIR = join(ROOT, 'public', 'logos');
const ARCHIVE_DIR = join(LOGOS_DIR, '_archive');
const PRODUCTS_PATH = join(ROOT, 'src', 'data', 'products.json');
const LOGO_UTILS_PATH = join(ROOT, 'src', 'utils', 'logoUtils.ts');
const MANIFEST_PATH = join(ROOT, 'src', 'utils', 'logoManifest.ts');

function autoSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, '-plus')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractOverrides(source) {
  const match = source.match(/slugOverrides\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\}/);
  if (!match) return {};
  const body = match[1];
  const overrides = {};
  const re = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    overrides[m[1]] = m[2];
  }
  return overrides;
}

function parseArgs(argv) {
  const opts = { prune: false, mode: 'delete', yes: false };
  for (const arg of argv) {
    if (arg === '--prune') {
      opts.prune = true;
    } else if (arg.startsWith('--prune=')) {
      opts.prune = true;
      const v = arg.slice('--prune='.length);
      if (v === 'archive' || v === 'delete') opts.mode = v;
      else throw new Error(`Unknown --prune mode: ${v} (expected 'delete' or 'archive')`);
    } else if (arg === '--archive') {
      opts.prune = true;
      opts.mode = 'archive';
    } else if (arg === '--yes' || arg === '-y') {
      opts.yes = true;
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    }
  }
  return opts;
}

function printHelp() {
  console.log(`Usage: check-logos [options]

Options:
  --prune              Delete orphan logo files (with confirmation prompt)
  --prune=archive      Move orphan logo files to public/logos/_archive/ instead of deleting
  --archive            Alias for --prune=archive
  --yes, -y            Skip the confirmation prompt
  --strict             Exit non-zero if any product is missing a logo
  --help, -h           Show this help

Without --prune, the script only reports orphans (dry-run / default behavior).
Strict mode can also be enabled via STRICT_LOGOS=1.`);
}

function confirm(question) {
  return new Promise((resolveP) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolveP(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  let logoFiles = existsSync(LOGOS_DIR)
    ? readdirSync(LOGOS_DIR).filter((f) => /\.(svg|png)$/i.test(f))
    : [];

  const filesBySlug = new Map();
  for (const f of logoFiles) {
    const slug = f.replace(/\.(svg|png)$/i, '');
    if (!filesBySlug.has(slug)) filesBySlug.set(slug, []);
    filesBySlug.get(slug).push(f);
  }
  let availableSlugs = Array.from(filesBySlug.keys()).sort();
  let rasterSlugs = availableSlugs
    .filter((slug) => (filesBySlug.get(slug) ?? []).some((file) => /\.png$/i.test(file)))
    .sort();

  const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf8'));
  const utilsSource = existsSync(LOGO_UTILS_PATH) ? readFileSync(LOGO_UTILS_PATH, 'utf8') : '';
  const overrides = extractOverrides(utilsSource);

  const missing = [];
  const usedSlugs = new Set();

  for (const p of products) {
    const slug = overrides[p.name] ?? autoSlug(p.name);
    if (availableSlugs.includes(slug)) {
      usedSlugs.add(slug);
    } else {
      missing.push({ name: p.name, expectedSlug: slug, source: overrides[p.name] ? 'override' : 'auto' });
    }
  }

  let orphanSlugs = availableSlugs.filter((s) => !usedSlugs.has(s));

  const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const dim = (s) => `\x1b[2m${s}\x1b[0m`;

  // Strict mode: when STRICT_LOGOS=1 (or `--strict` flag) is set, exit non-zero
  // if any product is missing a logo. Used by the prebuild step so production
  // deploys cannot ship without all logos. Local dev (`predev`) stays friendly
  // and only prints a warning.
  const strict =
    process.env.STRICT_LOGOS === '1' ||
    process.env.STRICT_LOGOS === 'true' ||
    process.argv.includes('--strict');

  console.log(dim('[check-logos] scanning products and logo files...'));
  if (missing.length === 0) {
    console.log(green(`[check-logos] OK — all ${products.length} products have logos.`));
  } else {
    const label = strict ? 'ERROR' : 'WARNING';
    const color = strict ? red : yellow;
    console.log(color(`[check-logos] ${label} — ${missing.length} product(s) missing logos:`));
    for (const m of missing) {
      console.log(
        color(`  - "${m.name}"`) +
          dim(`  (expected /logos/${m.expectedSlug}.svg via ${m.source})`),
      );
    }
    console.log(
      dim(
        '         Fix by either dropping the SVG into public/logos/ with the expected name,\n' +
          '         or adding an override in src/utils/logoUtils.ts (slugOverrides).',
      ),
    );
  }

  if (orphanSlugs.length > 0) {
    console.log(dim(`[check-logos] ${orphanSlugs.length} unused logo file(s): ${orphanSlugs.join(', ')}`));
  }

  if (opts.prune && orphanSlugs.length > 0) {
    const orphanFiles = orphanSlugs.flatMap((s) => filesBySlug.get(s) ?? []);
    const action = opts.mode === 'archive' ? 'archive' : 'delete';
    const target = opts.mode === 'archive' ? ` -> ${ARCHIVE_DIR.replace(ROOT + '/', '')}/` : '';
    console.log(
      yellow(
        `[check-logos] About to ${action} ${orphanFiles.length} orphan file(s)${target}:`,
      ),
    );
    for (const f of orphanFiles) console.log(dim(`  - logos/${f}`));

    let proceed = opts.yes;
    if (!proceed) {
      proceed = await confirm(`Proceed with ${action}? [y/N] `);
    }

    if (!proceed) {
      console.log(dim('[check-logos] prune cancelled — no files changed.'));
    } else {
      if (opts.mode === 'archive') mkdirSync(ARCHIVE_DIR, { recursive: true });
      let count = 0;
      for (const f of orphanFiles) {
        const src = join(LOGOS_DIR, f);
        try {
          if (opts.mode === 'archive') {
            renameSync(src, join(ARCHIVE_DIR, f));
          } else {
            unlinkSync(src);
          }
          count++;
        } catch (err) {
          console.log(red(`  ! failed to ${action} logos/${f}: ${err.message}`));
        }
      }
      console.log(green(`[check-logos] ${action}d ${count} file(s).`));

      // Refresh available slugs so the manifest reflects post-prune state.
      const remaining = readdirSync(LOGOS_DIR).filter((f) => /\.(svg|png)$/i.test(f));
      availableSlugs = Array.from(
        new Set(remaining.map((f) => f.replace(/\.(svg|png)$/i, ''))),
      ).sort();
      const remainingBySlug = new Map();
      for (const f of remaining) {
        const slug = f.replace(/\.(svg|png)$/i, '');
        if (!remainingBySlug.has(slug)) remainingBySlug.set(slug, []);
        remainingBySlug.get(slug).push(f);
      }
      rasterSlugs = availableSlugs
        .filter((slug) => (remainingBySlug.get(slug) ?? []).some((file) => /\.png$/i.test(file)))
        .sort();
    }
  } else if (opts.prune) {
    console.log(dim('[check-logos] nothing to prune.'));
  }

  mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
  const manifest =
    '// AUTO-GENERATED by scripts/check-logos.mjs — do not edit by hand.\n' +
    '// Regenerated automatically on `pnpm dev` and `pnpm build`.\n' +
    `export const availableLogoSlugs: ReadonlySet<string> = new Set(${JSON.stringify(availableSlugs, null, 2)});\n` +
    `export const rasterLogoSlugs: ReadonlySet<string> = new Set(${JSON.stringify(rasterSlugs, null, 2)});\n` +
    `export const missingLogoProducts: ReadonlyArray<{ name: string; expectedSlug: string }> = ${JSON.stringify(
      missing.map(({ name, expectedSlug }) => ({ name, expectedSlug })),
      null,
      2,
    )};\n`;
  writeFileSync(MANIFEST_PATH, manifest);
  console.log(dim(`[check-logos] wrote ${MANIFEST_PATH.replace(ROOT + '/', '')}`));

  if (strict && missing.length > 0) {
    console.log(
      red(
        `[check-logos] strict mode enabled — failing build because ${missing.length} product(s) are missing logos.`,
      ),
    );
    process.exit(1);
  }
}

main();
