import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center relative z-10 px-8">
        <motion.h1 
          className="text-[6vw] font-display font-bold text-text-primary leading-tight"
        >
          <motion.span
            className="block text-primary"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            All your favorite
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            subscriptions.
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-[2vw] text-text-secondary mt-6"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={phase >= 3 ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
        >
          One single marketplace.
        </motion.p>
      </div>
    </motion.div>
  );
}
