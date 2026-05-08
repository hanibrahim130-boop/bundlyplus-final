// Vercel Node serverless function: lightweight liveness probe.
// Lives at the repo root so it's auto-discovered as `/api/healthz` by Vercel.
// .mjs ensures ESM regardless of the root package.json's "type" field.

export default function handler(_req, res) {
  res.status(200).json({ status: "ok" });
}
