import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove the prerendered SEO shell the instant React mounts.
// This prevents the "flash of old content" between the static HTML
// and the hydrated React app. The shell is only useful for crawlers
// and the first ~200ms before JS executes.
const seoShell = document.getElementById("seo-prerender");
if (seoShell) seoShell.remove();

createRoot(document.getElementById("root")!).render(<App />);
