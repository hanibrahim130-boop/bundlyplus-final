import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "bundlyplus-intro-splash-seen";
const INTRO_DURATION_MS = 1480;
const REDUCED_DURATION_MS = 360;

function isPreviewMode() {
  if (typeof window === "undefined") return false;

  return (
    import.meta.env.DEV && window.location.search.includes("intro=preview")
  );
}

function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (isPreviewMode()) return true;

  try {
    return sessionStorage.getItem(SESSION_KEY) !== "true";
  } catch {
    return false;
  }
}

export function IntroSplash() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(shouldShowIntro);
  const isReduced = Boolean(reduceMotion);
  const isPreview = isPreviewMode();

  useEffect(() => {
    if (!isVisible) return;

    if (!isPreview) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        setIsVisible(false);
        return;
      }
    }

    const timeout = window.setTimeout(
      () => setIsVisible(false),
      isReduced ? REDUCED_DURATION_MS : INTRO_DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [isPreview, isReduced, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading BundlyPlus"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: isReduced ? 0 : -18 }}
          transition={{
            duration: isReduced ? 0.1 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#09060d] text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(236,72,153,0.12),rgba(9,6,13,0)_34%),linear-gradient(135deg,#140a1d_0%,#09060d_42%,#050406_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute inset-x-8 bottom-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div
            initial={isReduced ? false : { opacity: 0, scaleX: 0.72 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: isReduced ? 0.01 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute h-[420px] w-[82vw] max-w-[760px] rounded-full border border-white/[0.06]"
          />
          <motion.div
            initial={isReduced ? false : { opacity: 0, x: "-18%" }}
            animate={{ opacity: 1, x: "18%" }}
            transition={{
              duration: isReduced ? 0.01 : 1.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute h-[520px] w-40 rotate-12 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent blur-sm"
          />

          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: isReduced ? 0.01 : 0.54,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 mx-6 flex w-full max-w-md flex-col items-center text-center"
          >
            <motion.div
              initial={isReduced ? false : { opacity: 0.18, scale: 0.7 }}
              animate={
                isReduced
                  ? { opacity: 0.14, scale: 1 }
                  : { opacity: [0.18, 0.08, 0], scale: [0.7, 1.35, 1.75] }
              }
              transition={{
                delay: 0.12,
                duration: isReduced ? 0.01 : 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute top-0 h-40 w-40 rounded-full border border-pink-200/40"
            />

            <motion.div
              initial={isReduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: isReduced ? 0 : 0.1,
                duration: isReduced ? 0.01 : 0.56,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.12] to-white/[0.02]" />
              <img
                src="/logo-icon.png"
                alt="BundlyPlus"
                className="relative h-16 w-16 rounded-2xl object-contain"
              />
            </motion.div>

            <motion.h1
              initial={
                isReduced
                  ? false
                  : { opacity: 0, y: 10, letterSpacing: "0.14em" }
              }
              animate={{ opacity: 1, y: 0, letterSpacing: "0.015em" }}
              transition={{
                delay: isReduced ? 0 : 0.34,
                duration: isReduced ? 0.01 : 0.44,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 font-display text-[2rem] font-semibold leading-none text-white sm:text-5xl"
            >
              BundlyPlus
            </motion.h1>

            <motion.p
              initial={isReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: isReduced ? 0 : 0.52,
                duration: isReduced ? 0.01 : 0.36,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-4 text-sm font-medium tracking-[0.16em] text-white/60 sm:text-base"
            >
              Premium subscriptions. Better prices.
            </motion.p>

            <div className="mt-8 h-px w-64 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: isReduced ? 0 : 0.66,
                  duration: isReduced ? 0.16 : 0.58,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full origin-left bg-gradient-to-r from-transparent via-pink-200/80 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
