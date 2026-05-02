import type { Variants, Transition } from 'framer-motion';

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  hero: 0.8,
} as const;

type CubicBezier = [number, number, number, number];

export const EASE = {
  smooth: [0.25, 0.1, 0.25, 1.0] as CubicBezier,
  decel: [0.0, 0.0, 0.2, 1.0] as CubicBezier,
  spring: { type: 'spring', stiffness: 100, damping: 20 } as const,
};

export const STAGGER = {
  fast: 0.06,
  normal: 0.1,
  slow: 0.15,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.fast,
      delayChildren: 0.05,
    },
  },
};

export const defaultTransition: Transition = {
  duration: DURATION.normal,
  ease: EASE.smooth,
};

export const heroTransition = (delay: number = 0): Transition => ({
  duration: DURATION.hero,
  ease: EASE.decel,
  delay,
});
