import { db, productsTable, bundlesTable, settingsTable } from "@workspace/db";
import { readFileSync } from "fs";
import { resolve } from "path";

async function seed() {
  console.log("Seeding database...");

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
  for (const p of productsData) {
    await db
      .insert(productsTable)
      .values({
        id: p.id,
        name: p.name,
        description: p.description || "",
        category: p.category || "",
        duration: p.duration || "1 Month",
        accountType: p.account_type || "Shared",
        price: p.price,
        features: p.features || [],
        imageUrl: p.image_url || "",
        featured: p.featured || false,
        hot: p.hot || false,
      })
      .onConflictDoUpdate({
        target: productsTable.id,
        set: {
          name: p.name,
          description: p.description || "",
          category: p.category || "",
          duration: p.duration || "1 Month",
          accountType: p.account_type || "Shared",
          price: p.price,
          features: p.features || [],
          imageUrl: p.image_url || "",
          featured: p.featured || false,
          hot: p.hot || false,
        },
      });
  }
  console.log("Products seeded.");

  console.log(`Seeding ${bundlesData.length} bundles...`);
  for (const b of bundlesData) {
    await db
      .insert(bundlesTable)
      .values({
        id: b.id,
        name: b.name,
        description: b.description || "",
        price: b.price,
        originalPrice: b.originalPrice,
        duration: b.duration || "month",
        features: b.features || [],
      })
      .onConflictDoUpdate({
        target: bundlesTable.id,
        set: {
          name: b.name,
          description: b.description || "",
          price: b.price,
          originalPrice: b.originalPrice,
          duration: b.duration || "month",
          features: b.features || [],
        },
      });
  }
  console.log("Bundles seeded.");

  console.log("Seeding settings...");
  const siteSettings = settingsData.find((s: any) => s.id === "site");
  const bundlesTiers = settingsData.find((s: any) => s.id === "bundles");

  if (siteSettings) {
    const { id, admin_password_hash, ...siteValues } = siteSettings;
    await db
      .insert(settingsTable)
      .values({ key: "site", value: siteValues })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value: siteValues },
      });
  }

  if (bundlesTiers) {
    const { id, ...tierValues } = bundlesTiers;
    await db
      .insert(settingsTable)
      .values({ key: "bundles", value: tierValues })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value: tierValues },
      });
  }
  console.log("Settings seeded.");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
