import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/orders", async (req, res) => {
  try {
    const { items, total, customerNote } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order must include at least one item" });
      return;
    }

    if (typeof total !== "number" || total <= 0) {
      res.status(400).json({ error: "Invalid total" });
      return;
    }

    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== "number" || typeof item.quantity !== "number") {
        res.status(400).json({ error: "Each item must have id, name, price, and quantity" });
        return;
      }
      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        res.status(400).json({ error: "Item quantity must be a positive integer" });
        return;
      }
      if (!["product", "bundle"].includes(item.type)) {
        res.status(400).json({ error: "Item type must be 'product' or 'bundle'" });
        return;
      }
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        items,
        total,
        customerNote: customerNote || "",
      })
      .returning();

    res.status(201).json({
      id: order.id,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt?.getTime(),
    });
  } catch (err) {
    console.error("Failed to create order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
