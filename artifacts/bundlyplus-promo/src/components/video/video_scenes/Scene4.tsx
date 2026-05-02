import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-secondary"
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="text-center max-w-5xl px-12 z-10">
        <motion.div
          className="w-[12vw] h-[12vw] bg-white rounded-3xl mx-auto mb-8 shadow-xl flex items-center justify-center text-primary"
          initial={{ opacity: 0, y: -50 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[6vw] h-[6vw]">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </motion.div>
        <motion.h2 
          className="text-[4.5vw] font-display font-bold text-text-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Pay your way.
        </motion.h2>
        <motion.p 
          className="text-[2.2vw] text-text-secondary mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Local payment options for the entire MENA region.
        </motion.p>
      </div>
      
      {/* Decorative background cards */}
      <motion.div 
        className="absolute top-[10%] left-[10%] w-[20vw] h-[12vw] bg-white/40 rounded-2xl rotate-[-15deg] blur-sm"
        animate={{ y: [0, 20, 0], rotate: [-15, -10, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[10%] right-[10%] w-[20vw] h-[12vw] bg-white/40 rounded-2xl rotate-[15deg] blur-sm"
        animate={{ y: [0, -20, 0], rotate: [15, 10, 15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
