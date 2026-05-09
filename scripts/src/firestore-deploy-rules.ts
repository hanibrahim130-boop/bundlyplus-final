// Deploy Firestore security rules via the Firebase Rules REST API.
//
// Why not `firebase deploy --only firestore:rules`?
//   The "Firebase Admin SDK Service Agent" role (default for service accounts
//   created via the Firebase console) lacks `serviceusage.services.get`, which
//   firebase-tools requires for its pre-deploy API enablement check. This
//   script bypasses that check by calling firebaserules.googleapis.com directly.
//
// Reads service account from FIREBASE_SERVICE_ACCOUNT_JSON (env content or path)
// or the local fallback (see ./lib/firebase-admin.ts).
import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAdminApp, loadServiceAccount } from "./lib/firebase-admin.js";

getAdminApp();
const sa = loadServiceAccount();
const PROJECT = sa.project_id as string;
const RULES_PATH = resolve(import.meta.dirname, "../../artifacts/bundlyplus/firestore.rules");

async function getToken(): Promise<string> {
  const credential = admin.app().options.credential as admin.credential.Credential;
  const at = await credential.getAccessToken();
  return at.access_token;
}

async function main() {
  const rulesContent = readFileSync(RULES_PATH, "utf-8");
  console.log(`  rules file: ${RULES_PATH} (${rulesContent.length} bytes)`);

  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  console.log(`  creating ruleset for project ${PROJECT}...`);
  const createRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/rulesets`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: {
          files: [{ name: "firestore.rules", content: rulesContent }],
        },
      }),
    },
  );
  if (!createRes.ok) {
    throw new Error(`createRuleset ${createRes.status}: ${await createRes.text()}`);
  }
  const ruleset = (await createRes.json()) as { name: string };
  console.log(`  ruleset created: ${ruleset.name}`);

  console.log(`  updating release cloud.firestore...`);
  const releaseRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases/cloud.firestore`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        release: {
          name: `projects/${PROJECT}/releases/cloud.firestore`,
          rulesetName: ruleset.name,
        },
      }),
    },
  );
  if (!releaseRes.ok) {
    throw new Error(`updateRelease ${releaseRes.status}: ${await releaseRes.text()}`);
  }
  const release = (await releaseRes.json()) as Record<string, unknown>;
  console.log(`  release updated:`, release);
  console.log(`\n  ✓ Firestore rules deployed to ${PROJECT}`);
}
main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
