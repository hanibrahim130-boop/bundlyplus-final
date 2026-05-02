import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type ServiceAccountLike = Record<string, unknown>;

function loadServiceAccount(): ServiceAccountLike {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (fromEnv) {
    return JSON.parse(readFileSync(resolve(fromEnv), "utf-8")) as ServiceAccountLike;
  }

  const fallbackPath = resolve(
    import.meta.dirname,
    "../../attached_assets/bundlyplus-firebase-adminsdk-fbsvc-983286af8b_1774297045593.json",
  );
  return JSON.parse(readFileSync(fallbackPath, "utf-8")) as ServiceAccountLike;
}

async function main() {
  const email = process.env.FIREBASE_ADMIN_EMAIL?.trim();
  if (!email) {
    console.error("Missing FIREBASE_ADMIN_EMAIL.");
    console.error('Example: FIREBASE_ADMIN_EMAIL="admin@yourdomain.com" pnpm --filter @workspace/scripts run set-admin-claim');
    process.exit(1);
  }

  const serviceAccount = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  const user = await admin.auth().getUserByEmail(email);
  const existingClaims = user.customClaims ?? {};

  await admin.auth().setCustomUserClaims(user.uid, {
    ...existingClaims,
    admin: true,
  });

  console.log(`Admin claim set for ${email} (uid: ${user.uid})`);
}

main().catch((err) => {
  console.error("Failed to set admin claim:", err);
  process.exit(1);
});
