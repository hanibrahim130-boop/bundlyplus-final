import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";
import { getAdminApp } from "./lib/firebase-admin.js";

getAdminApp();
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

  console.log("Seeding promotions...");
  const mayPromo = {
    title: "May 1-2 only",
    bodyEn:
      "Celebrate the first days of May with 20% off your next digital subscription order. Ask for the May discount when you checkout on WhatsApp.",
    bodyAr:
      "احتفل بأول أيام مايو مع خصم 20% على طلبك التالي للاشتراكات الرقمية. اطلب خصم مايو عند إتمام الدفع على واتساب.",
    startDate: Date.UTC(2026, 4, 1, 0, 0, 0),
    endDate: Date.UTC(2026, 4, 2, 23, 59, 59),
    discountLabel: "20% OFF",
    ctaTextEn: "Shop the deal",
    ctaTextAr: "احصل على العرض",
    ctaPath: "/products",
    bgGradient: "from-pink-500 via-rose-500 to-orange-400",
    enabled: true,
    created_at: Date.now(),
  };
  await db.collection("promotions").doc("may-2026-launch").set(mayPromo);
  console.log("Promotions seeded.");

  console.log("Firestore seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
