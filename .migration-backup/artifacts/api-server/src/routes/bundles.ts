import { Router, type IRouter } from "express";
import { db, bundlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/bundles", async (_req, res) => {
  try {
    const bundles = await db.select().from(bundlesTable);

    const mapped = bundles.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      price: b.price,
      originalPrice: b.originalPrice,
      duration: b.duration,
      features: b.features,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch bundles:", err);
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
});

router.get("/bundles/:id", async (req, res) => {
  try {
    const [bundle] = await db
      .select()
      .from(bundlesTable)
      .where(eq(bundlesTable.id, req.params.id))
      .limit(1);

    if (!bundle) {
      res.status(404).json({ error: "Bundle not found" });
      return;
    }

    res.json({
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      duration: bundle.duration,
      features: bundle.features,
    });
  } catch (err) {
    console.error("Failed to fetch bundle:", err);
    res.status(500).json({ error: "Failed to fetch bundle" });
  }
});

export default router;
