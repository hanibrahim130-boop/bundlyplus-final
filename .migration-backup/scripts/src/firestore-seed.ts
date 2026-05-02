import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";

const sa = JSON.parse(
  readFileSync(
    resolve(
      import.meta.dirname,
      "../../attached_assets/bundlyplus-firebase-adminsdk-fbsvc-983286af8b_1774297045593.json"
    ),
    "utf-8"
  )
);

admin.initializeApp({ credential: admin.credential.cert(sa as admin.ServiceAccount) });
const db = admin.firestore();

async function seed() {
  console.log("Seeding Firestore...");

  const productsPath = resolve(
    import.meta.dirname,
    "../../artifacts/bundlyplus/src/data/products.json"
  );
  const bundlesPath = resolve(
    import.meta.dirname,
    "../../artifacts/bundlyplus/src/data/bundles.json"
  );
  const settingsPath = resolve(
    import.meta.dirname,
    "../../artifacts/bundlyplus/src/data/settings.json"
  );

  const productsData = JSON.parse(readFileSync(productsPath, "utf-8"));
  const bundlesData = JSON.parse(readFileSync(bundlesPath, "utf-8"));
  const settingsData = JSON.parse(readFileSync(settingsPath, "utf-8"));

  console.log(`Seeding ${productsData.length} products...`);
  const productBatch = db.batch();
  for (const p of productsData) {
    const ref = db.collection("products").doc(p.id);
    productBatch.set(ref, {
      name: p.name,
      description: p.description || "",
      category: p.category || "",
      duration: p.duration || "1 Month",
      account_type: p.account_type || "Shared",
      price: p.price,
      features: p.features || [],
      image_url: p.image_url || "",
      featured: p.featured || false,
      hot: p.hot || false,
      created_at: Date.now(),
    });
  }
  await productBatch.commit();
  console.log("Products seeded.");

  console.log(`Seeding ${bundlesData.length} bundles...`);
  const bundleBatch = db.batch();
  for (const b of bundlesData) {
    const ref = db.collection("bundles").doc(b.id);
    bundleBatch.set(ref, {
      name: b.name,
      description: b.description || "",
      price: b.price,
      originalPrice: b.originalPrice,
      duration: b.duration || "month",
      features: b.features || [],
    });
  }
  await bundleBatch.commit();
  console.log("Bundles seeded.");

  console.log("Seeding settings...");
  const siteSettings = settingsData.find((s: any) => s.id === "site");
  const bundlesTiers = settingsData.find((s: any) => s.id === "bundles");

  if (siteSettings) {
    const { id, admin_password_hash, ...siteValues } = siteSettings;
    await db.collection("settings").doc("site").set(siteValues);
  }

  if (bundlesTiers) {
    const { id, ...tierValues } = bundlesTiers;
    await db.collection("settings").doc("bundles").set(tierValues);
  }
  console.log("Settings seeded.");

  console.log("Firestore seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
