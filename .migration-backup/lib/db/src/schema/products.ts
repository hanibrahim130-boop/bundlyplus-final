import { pgTable, text, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default(""),
  duration: text("duration").notNull().default("1 Month"),
  accountType: text("account_type").notNull().default("Shared"),
  price: real("price").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url").default(""),
  featured: boolean("featured").notNull().default(false),
  hot: boolean("hot").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
