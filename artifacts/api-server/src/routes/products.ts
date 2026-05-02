import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    const conditions = [];

    if (category && category !== "All") {
      conditions.push(eq(productsTable.category, String(category)));
    }

    if (search) {
      const term = `%${String(search)}%`;
      conditions.push(
        or(
          ilike(productsTable.name, term),
          ilike(productsTable.description, term)
        )!
      );
    }

    if (featured === "true") {
      conditions.push(eq(productsTable.featured, true));
    }

    const products = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(productsTable.name);

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      duration: p.duration,
      account_type: p.accountType,
      price: p.price,
      features: p.features,
      image_url: p.imageUrl,
      featured: p.featured,
      hot: p.hot,
      created_at: p.createdAt?.getTime(),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, req.params.id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      duration: product.duration,
      account_type: product.accountType,
      price: product.price,
      features: product.features,
      image_url: product.imageUrl,
      featured: product.featured,
      hot: product.hot,
      created_at: product.createdAt?.getTime(),
    });
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
