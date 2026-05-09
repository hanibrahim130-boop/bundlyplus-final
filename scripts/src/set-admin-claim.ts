import admin from "firebase-admin";
import { getAdminApp } from "./lib/firebase-admin.js";

async function main() {
  const email = process.env.FIREBASE_ADMIN_EMAIL?.trim();
  if (!email) {
    console.error("Missing FIREBASE_ADMIN_EMAIL.");
    console.error(
      'Example: FIREBASE_ADMIN_EMAIL="admin@yourdomain.com" pnpm --filter @workspace/scripts run set-admin-claim',
    );
    process.exit(1);
  }

  getAdminApp();

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
