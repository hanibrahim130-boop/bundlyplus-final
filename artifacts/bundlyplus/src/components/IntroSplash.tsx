import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "bundlyplus-intro-splash-seen";
const INTRO_DURATION_MS = 1520;
const REDUCED_DURATION_MS = 420;

const orbs = [
  "left-[12%] top-[18%] h-44 w-44 bg-pink-500/25",
  "right-[10%] top-[16%] h-56 w-56 bg-purple-500/20",
  "bottom-[14%] left-[25%] h-48 w-48 bg-fuchsia-400/15",
] as const;

const particles = [
  "left-[18%] top-[34%] h-1.5 w-1.5",
  "left-[31%] top-[21%] h-1 w-1",
  "right-[26%] top-[30%] h-1.5 w-1.5",
  "right-[18%] bottom-[32%] h-1 w-1",
  "left-[24%] bottom-[24%] h-1 w-1",
  "right-[38%] bottom-[20%] h-1.5 w-1.5",
] as const;

function shouldShowIntro() {
  if (typeof window === "undefined") return false;

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

  useEffect(() => {
    if (!isVisible) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      setIsVisible(false);
      return;
    }

    const timeout = window.setTimeout(
      () => setIsVisible(false),
      isReduced ? REDUCED_DURATION_MS : INTRO_DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [isReduced, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading BundlyPlus"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: isReduced ? 0 : -28 }}
          transition={{ duration: isReduced ? 0.12 : 0.32, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,#42215f_0%,#180b2e_42%,#05030b_100%)] text-white"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_38%,rgba(236,72,153,0.12))]" />

          {!isReduced &&
            orbs.map((orb, index) => (
              <motion.div
                key={orb}
                initial={{ opacity: 0.55, scale: 0.95 }}
                animate={{
                  opacity: [0.35, 0.62, 0.42],
                  scale: [0.95, 1.08, 1],
                  x: index === 1 ? [0, -18, 6] : [0, 16, -6],
                  y: index === 2 ? [0, -12, 8] : [0, 14, -8],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                className={`absolute rounded-full blur-3xl ${orb}`}
              />
            ))}

          {!isReduced &&
            particles.map((particle, index) => (
              <motion.span
                key={particle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 0.85, 0.25], y: [-2, -18, -28] }}
                transition={{
                  delay: 0.12 + index * 0.06,
                  duration: 1.4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeOut",
                }}
                className={`absolute rounded-full bg-white/80 shadow-[0_0_18px_rgba(244,114,182,0.9)] ${particle}`}
              />
            ))}

          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: isReduced ? 0.01 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 mx-6 flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-white/15 bg-white/[0.07] px-8 py-10 text-center shadow-[0_24px_80px_rgba(15,2,32,0.5)] backdrop-blur-2xl"
          >
            <motion.div
              initial={isReduced ? false : { opacity: 0.45, scale: 0.75 }}
              animate={
                isReduced
                  ? { opacity: 0.35, scale: 1 }
                  : { opacity: [0.45, 0.16, 0], scale: [0.75, 1.45, 1.85] }
              }
              transition={{
                delay: 0.18,
                duration: isReduced ? 0.01 : 0.95,
                ease: "easeOut",
              }}
              className="absolute top-8 h-32 w-32 rounded-full bg-pink-400/40 blur-xl"
            />

            <motion.div
              initial={isReduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: isReduced ? 0 : 0.16,
                duration: isReduced ? 0.01 : 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/20 bg-white/10 shadow-[0_0_60px_rgba(236,72,153,0.5)] backdrop-blur-xl"
            >
              <img
                src="/logo-icon.png"
                alt="BundlyPlus"
                className="h-16 w-16 rounded-2xl object-contain"
              />
            </motion.div>

            <motion.h1
              initial={
                isReduced
                  ? false
                  : { opacity: 0, y: 12, letterSpacing: "0.18em" }
              }
              animate={{ opacity: 1, y: 0, letterSpacing: "0.04em" }}
              transition={{
                delay: isReduced ? 0 : 0.46,
                duration: isReduced ? 0.01 : 0.42,
                ease: "easeOut",
              }}
              className="mt-7 font-display text-3xl font-semibold tracking-wide text-white drop-shadow-[0_0_24px_rgba(236,72,153,0.35)]"
            >
              BundlyPlus
            </motion.h1>

            <motion.p
              initial={isReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: isReduced ? 0 : 0.68,
                duration: isReduced ? 0.01 : 0.34,
                ease: "easeOut",
              }}
              className="mt-3 text-sm font-medium tracking-[0.22em] text-pink-100/80"
            >
              Premium subscriptions. Better prices.
            </motion.p>

            <div className="mt-7 h-px w-56 overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: isReduced ? 0 : 0.82,
                  duration: isReduced ? 0.16 : 0.62,
                  ease: "easeInOut",
                }}
                className="h-full origin-left bg-gradient-to-r from-transparent via-pink-300 to-purple-300 shadow-[0_0_18px_rgba(236,72,153,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
