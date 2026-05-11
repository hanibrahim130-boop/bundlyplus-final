import { useTheme } from "@/lib/theme";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Global animated background — renders once at the app-shell level
 * (App.tsx) and sits behind every route.
 *
 * Motion budget (see docs/performance.md):
 *  - Mobile: single rasterised radial gradient. Zero animations, zero
 *    blur. contain: strict + content-visibility: auto keeps it off the
 *    paint hot path.
 *  - Desktop: 3 aurora blobs with slow 18-22s CSS-only drift.
 *    No mix-blend-mode, no filter sweeps — those were the expensive
 *    parts of the old per-page hero effects. blur() radii capped at
 *    60px so the GPU rasterises one texture per blob and reuses it.
 *  - prefers-reduced-motion: animations halted via the global rule in
 *    index.css (.bg-blob / .hero-aurora selectors already covered).
 *
 * The hero / other sections can still layer their own content on top,
 * but must NOT add their own aurora / spotlight / dotted grid —
 * stacking identical effects doubles GPU cost with no visual benefit.
 */
export function Background() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  if (isMobile) {
    const bg = isDark
      ? "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(236,72,153,0.10) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 70%)"
      : "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(236,72,153,0.12) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(216,180,226,0.20) 0%, transparent 70%)";
    return (
      <div
        className={`fixed inset-0 z-[-1] pointer-events-none ${isDark ? "bg-[#0d1117]" : "bg-[#FAFAFA]"}`}
        style={{
          backgroundImage: bg,
          contain: "strict",
          contentVisibility: "auto",
        }}
        aria-hidden="true"
      />
    );
  }

  // Desktop: animated drifting blobs. Colors tuned to match the brand
  // gradient (pink -> purple -> amber) so every page inherits the
  // premium-cinematic mood without paying for per-page effects.
  if (isDark) {
    return (
      <div
        className="fixed inset-0 z-[-1] overflow-hidden bg-[#0d1117] pointer-events-none"
        style={{ contain: "strict" }}
        aria-hidden="true"
      >
        <div
          className="bg-blob bg-blob-1 absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] blur-[60px] rounded-full"
          style={{ backgroundColor: "rgba(236, 72, 153, 0.14)" }}
        />
        <div
          className="bg-blob bg-blob-2 absolute top-[20%] right-[-15%] w-[40vw] h-[40vw] blur-[60px] rounded-full"
          style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
        />
        <div
          className="bg-blob bg-blob-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] rounded-full blur-[60px]"
          style={{ backgroundColor: "rgba(251, 146, 60, 0.08)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFAFA] pointer-events-none"
      style={{ contain: "strict" }}
      aria-hidden="true"
    >
      <div className="bg-blob bg-blob-1 absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] blur-[55px] rounded-full bg-pink-200/55" />
      <div
        className="bg-blob bg-blob-2 absolute top-[20%] right-[-15%] w-[40vw] h-[40vw] blur-[55px] rounded-full"
        style={{ backgroundColor: "rgba(216, 180, 226, 0.45)" }}
      />
      <div className="bg-blob bg-blob-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-orange-100/65 blur-[60px]" />
    </div>
  );
}
