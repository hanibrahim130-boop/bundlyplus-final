import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";

/**
 * Thin top-of-page progress bar, NProgress-style.
 *
 * - Fires on every wouter location change.
 * - Trickles up to 90% while the route's lazy chunk is loading + the
 *   Suspense boundary is rendering the fallback.
 * - Snaps to 100% when `RouteReadySignal` mounts for the new location
 *   (i.e. the real route committed a frame). That signal lives inside
 *   the Suspense boundary so it only renders after the chunk resolves.
 * - No-ops entirely when the user has `prefers-reduced-motion: reduce`.
 */

interface RouteProgressApi {
  start: () => void;
  done: () => void;
}

const RouteProgressContext = createContext<RouteProgressApi | null>(null);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function RouteProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();
  const firstRenderRef = useRef(true);
  const activeRef = useRef(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(prefersReducedMotion());

  function clearTimers() {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  }

  const start = useCallback(() => {
    if (reducedMotionRef.current) return;
    clearTimers();
    activeRef.current = true;
    setVisible(true);
    setProgress(8);
    trickleRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        // Fast at first (to feel responsive), slower near the ceiling
        // so the bar looks like it's waiting on real work rather than
        // sprinting to 100% regardless.
        const inc = p < 30 ? 10 : p < 60 ? 5 : p < 80 ? 2 : 1;
        return Math.min(90, p + inc);
      });
    }, 150);
  }, []);

  const done = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    clearTimers();
    setProgress(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    start();
    // Safety net: if `RouteReadySignal` never mounts (e.g. a route
    // throws and the SentryErrorBoundary catches above the signal),
    // auto-finish after 4s so the bar doesn't hang forever.
    const safety = setTimeout(() => done(), 4_000);
    return () => {
      clearTimeout(safety);
    };
  }, [location, start, done]);

  useEffect(() => () => clearTimers(), []);

  const api: RouteProgressApi = { start, done };

  return (
    <RouteProgressContext.Provider value={api}>
      {visible && !reducedMotionRef.current ? (
        <div
          role="progressbar"
          aria-label="Loading page"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="fixed inset-x-0 top-0 z-100 h-0.5 pointer-events-none"
        >
          <div
            className="h-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500 shadow-[0_0_8px_rgba(236,72,153,0.55)] transition-[width,opacity] duration-200 ease-out"
            style={{
              width: `${progress}%`,
              opacity: progress === 0 ? 0 : 1,
            }}
          />
        </div>
      ) : null}
      {children}
    </RouteProgressContext.Provider>
  );
}

/**
 * Mount this inside the Suspense boundary. It fires `done()` two RAFs
 * after each route change, which is when the real route content has
 * committed a frame. When a lazy chunk is still loading, this component
 * simply isn't rendered (Suspense shows the fallback instead), so the
 * bar stays at ~90% until the chunk resolves.
 */
export function RouteReadySignal() {
  const api = useContext(RouteProgressContext);
  const [location] = useLocation();

  useEffect(() => {
    if (!api) return;
    let cancelled = false;
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      const raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        api.done();
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
    };
  }, [location, api]);

  return null;
}
