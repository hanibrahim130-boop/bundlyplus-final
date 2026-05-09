import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "bundlyplus-intro-splash-seen";
const DURATION_MS = 1900;
const REDUCED_DURATION_MS = 260;

function isPreviewMode() {
  if (typeof window === "undefined") return false;
  return import.meta.env.DEV && window.location.search.includes("intro=preview");
}

function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (isPreviewMode()) return true;
  try {
    const seen = sessionStorage.getItem(SESSION_KEY) === "true";
    if (seen) return false;
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  } catch {
    return false;
  }
}

export function IntroSplash() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(shouldShowIntro);
  const isReduced = Boolean(reduceMotion);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = window.setTimeout(
      () => setIsVisible(false),
      isReduced ? REDUCED_DURATION_MS : DURATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [isReduced, isVisible]);

  const noAnim = isReduced ? { opacity: 1, scale: 1, x: 0, y: 0 } : false;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading BundlyPlus"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{
            duration: isReduced ? 0.08 : 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* Deep backdrop */}
          <div className="absolute inset-0 bg-[#07040a]" />

          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_64%_54%_at_50%_40%,rgba(120,40,120,0.13)_0%,rgba(9,6,13,0)_62%)]" />

          {/* Soft pink glow center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(236,72,153,0.07),transparent_50%)]" />

          {/* Orb 1 - slow drift */}
          <motion.div
            initial={noAnim || { opacity: 0, x: "-8vw", y: "4vh" }}
            animate={{ opacity: [0.18, 0.31, 0.18], x: "2vw", y: "-3vh" }}
            transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[18%] left-[15%] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.22),transparent_64%)] blur-3xl"
          />

          {/* Orb 2 - slow drift opposite */}
          <motion.div
            initial={noAnim || { opacity: 0, x: "6vw", y: "-2vh" }}
            animate={{ opacity: [0.12, 0.25, 0.12], x: "-3vw", y: "4vh" }}
            transition={{ duration: 3.0, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            className="absolute bottom-[22%] right-[12%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_62%)] blur-3xl"
          />

          {/* Orb 3 - subtle accent */}
          <motion.div
            initial={noAnim || { opacity: 0, x: "-4vw", y: "-6vh" }}
            animate={{ opacity: [0.08, 0.18, 0.08], x: "4vw", y: "2vh" }}
            transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[55%] left-[40%] h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.16),transparent_60%)] blur-3xl"
          />

          {/* Floating particles */}
          <motion.div
            initial={noAnim || { opacity: 0, y: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4], y: [-6, -16, -6] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            className="absolute top-[28%] left-[34%] h-0.5 w-0.5 rounded-full bg-pink-300/70 shadow-[0_0_6px_2px_rgba(236,72,153,0.5)]"
          />
          <motion.div
            initial={noAnim || { opacity: 0, y: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3], y: [-10, -20, -10] }}
            transition={{ duration: 2.1, delay: 0.3, ease: "easeInOut", repeat: Infinity }}
            className="absolute top-[42%] right-[28%] h-[3px] w-[3px] rounded-full bg-purple-300/60 shadow-[0_0_5px_2px_rgba(168,85,247,0.4)]"
          />
          <motion.div
            initial={noAnim || { opacity: 0, y: 0 }}
            animate={{ opacity: [0.2, 0.7, 0.2], y: [-5, -14, -5] }}
            transition={{ duration: 2.4, delay: 0.6, ease: "easeInOut", repeat: Infinity }}
            className="absolute bottom-[35%] left-[22%] h-[2px] w-[2px] rounded-full bg-pink-200/50 shadow-[0_0_4px_1px_rgba(236,72,153,0.35)]"
          />

          {/* Top edge line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

          {/* Bottom edge line */}
          <div className="absolute inset-x-8 bottom-10 h-px bg-gradient-to-r from-transparent via-white/06 to-transparent" />

          {/* Glass ring - subtle */}
          <motion.div
            initial={noAnim || { opacity: 0, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-[420px] w-[82vw] max-w-[760px] rounded-full border border-white/[0.05] bg-white/[0.008] backdrop-blur-[1px]"
          />

          {/* Central content */}
          <motion.div
            initial={noAnim || { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-6 flex w-full max-w-md flex-col items-center text-center"
          >
            {/* Glow pulse ring behind logo */}
            <motion.div
              initial={noAnim || { opacity: 0, scale: 0.45 }}
              animate={
                isReduced
                  ? { opacity: 0.06, scale: 1.0 }
                  : { opacity: [0, 0.09, 0.03, 0], scale: [0.45, 1.15, 1.35, 1.55] }
              }
              transition={{ delay: 0.08, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1 h-40 w-40 rounded-full border border-pink-300/30 bg-pink-500/[0.04] blur-[1px]"
            />

            {/* Second pulse - broader */}
            <motion.div
              initial={noAnim || { opacity: 0, scale: 0.5 }}
              animate={
                isReduced
                  ? { opacity: 0.04, scale: 1.0 }
                  : { opacity: [0, 0.06, 0.02, 0], scale: [0.5, 1.25, 1.5, 1.8] }
              }
              transition={{ delay: 0.14, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1 h-40 w-40 rounded-full border border-purple-300/20 bg-purple-500/[0.03] blur-[1px]"
            />

            {/* Logo container — glassmorphism */}
            <motion.div
              initial={noAnim || { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.06, duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/12 bg-white/[0.05] shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(236,72,153,0.06)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.14] via-white/[0.04] to-white/[0.01]" />
              <img
                src="/logo-icon.png"
                alt="BundlyPlus"
                className="relative z-10 h-16 w-16 rounded-2xl object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={
                isReduced
                  ? false
                  : { opacity: 0, y: 10, filter: "blur(2px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.28, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 font-display text-[2rem] font-semibold leading-none tracking-[0.015em] text-white sm:text-5xl"
            >
              BundlyPlus
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={isReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-sm font-medium tracking-[0.14em] text-white/55 sm:text-base"
            >
              Premium subscriptions. Better prices.
            </motion.p>

            {/* Shimmer progress line */}
            <div className="mt-7 h-px w-56 overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.58,
                  duration: 0.52,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full origin-left bg-gradient-to-r from-transparent via-pink-200/70 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
