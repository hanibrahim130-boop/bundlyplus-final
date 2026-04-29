import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";

const router: IRouter = Router();

const PUBLIC_SETTINGS_KEYS = new Set(["site", "bundles"]);

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(settingsTable);

    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      if (PUBLIC_SETTINGS_KEYS.has(row.key)) {
        settings[row.key] = row.value;
      }
    }

    res.json(settings);
  } catch (err) {
    console.error("Failed to fetch settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

export default router;
