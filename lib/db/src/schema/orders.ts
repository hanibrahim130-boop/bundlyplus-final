import { pgTable, text, real, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  customerNote: text("customer_note").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "bundle";
  duration?: string;
}

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, status: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
