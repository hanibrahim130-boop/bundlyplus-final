import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isDevServer =
  process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    ...(isDevServer
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
            m.default(),
          ),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Ship React + the router together — they're on every page.
          "vendor-react": ["react", "react-dom", "wouter"],

          // Firestore is needed by products/settings/promotions — parts
          // of the home page. Keep it eager. Split auth into its own chunk
          // so anonymous pageloads never pay for it; it's loaded by the
          // Clerk->Firebase bridge and the admin panel on demand.
          "vendor-firebase-app": ["firebase/app", "firebase/firestore"],
          "vendor-firebase-auth": ["firebase/auth"],

          // Clerk is a heavy dependency but is referenced by the shell on
          // every route, so it stays in the eager critical chunk. Motion
          // and UI primitives are both shared across multiple lazy routes
          // so keep them as dedicated shared chunks.
          "vendor-motion": ["framer-motion"],
          "vendor-ui": [
            "lucide-react",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-toast",
          ],

          // Analytics is optional and initializes fire-and-forget from the
          // browser entry, so let it land in its own chunk; browsers that
          // block the tracker (adblock, DNT) won't pay the download cost.
          "vendor-analytics": ["posthog-js"],
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    headers: {
      "Cache-Control": "no-store",
      "Link": '</sitemap.xml>; rel="sitemap", </api>; rel="service-doc", </.well-known/api-catalog>; rel="api-catalog"',
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
