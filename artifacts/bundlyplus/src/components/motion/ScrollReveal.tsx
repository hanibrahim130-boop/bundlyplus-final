import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, slideInLeft, slideInRight, defaultTransition, DURATION, EASE } from '@/lib/motion';

type AnimationType = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight';

const variantMap: Record<AnimationType, Variants> = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft: slideInLeft,
  slideRight: slideInRight,
};

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = DURATION.normal,
  className = '',
  once = true,
  margin = '-60px',
}: ScrollRevealProps) {
  const variants = variantMap[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={{
        duration,
        ease: EASE.smooth,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  margin?: string;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.1,
  once = true,
  margin = '-60px',
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  animation = 'fadeUp',
}: {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
}) {
  return (
    <motion.div
      variants={variantMap[animation]}
      transition={defaultTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
