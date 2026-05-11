import { useTheme } from "@/lib/theme";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Global background — renders once at the app-shell level and sits
 * behind every route.
 *
 * Rebuilt for the Apple-style (v5) site:
 *  - Light mode: near-white (#FBFBFD) with a whisper of pink glow
 *    in the top-right corner. No blobs, no animation — matches the
 *    quiet apple.com feel.
 *  - Dark mode: pure black with two low-opacity aurora blobs kept
 *    from the previous pass so the page doesn't feel flat.
 *  - Mobile: rasterised gradient only, no blurs, no animations.
 *
 * prefers-reduced-motion: animations freeze via the global rule in
 * index.css (.bg-blob selector).
 */
export function Background() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  // Light mode — Apple-clean, nearly white, tiny pink wash
  if (!isDark) {
    if (isMobile) {
      return (
        <div
          className="fixed inset-0 z-[-1] pointer-events-none"
          style={{
            backgroundColor: "#FBFBFD",
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 90% 0%, rgba(236,72,153,0.06) 0%, transparent 70%)",
            contain: "strict",
            contentVisibility: "auto",
          }}
          aria-hidden="true"
        />
      );
    }
    return (
      <div
        className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
        style={{
          backgroundColor: "#FBFBFD",
          contain: "strict",
        }}
        aria-hidden="true"
      >
        {/* Single low-opacity pink wash, no animation */}
        <div
          className="absolute -top-40 -right-40 w-[55vw] h-[55vw] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.10) 0%, rgba(236,72,153,0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.05) 0%, rgba(168,85,247,0) 70%)",
          }}
        />
      </div>
    );
  }

  // Dark mode
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(236,72,153,0.08) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(139,92,246,0.06) 0%, transparent 70%)",
          contain: "strict",
          contentVisibility: "auto",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{
        backgroundColor: "#000000",
        contain: "strict",
      }}
      aria-hidden="true"
    >
      <div
        className="bg-blob bg-blob-1 absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] blur-[60px] rounded-full"
        style={{ backgroundColor: "rgba(236, 72, 153, 0.12)" }}
      />
      <div
        className="bg-blob bg-blob-2 absolute top-[20%] right-[-15%] w-[40vw] h-[40vw] blur-[60px] rounded-full"
        style={{ backgroundColor: "rgba(139, 92, 246, 0.10)" }}
      />
      <div
        className="bg-blob bg-blob-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] rounded-full blur-[60px]"
        style={{ backgroundColor: "rgba(251, 146, 60, 0.06)" }}
      />
    </div>
  );
}
