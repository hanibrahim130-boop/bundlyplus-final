import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-bg-light"
      initial={{ x: '100%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-center gap-16 px-12 w-full max-w-6xl">
        <motion.div 
          className="w-[20vw] h-[20vw] bg-success rounded-full flex items-center justify-center shadow-2xl relative"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-success"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* WhatsApp-ish icon placeholder */}
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-[10vw] h-[10vw]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </motion.div>
        
        <div className="flex flex-col flex-1">
          <motion.h2 
            className="text-[5vw] font-display font-bold text-text-primary leading-tight"
            initial={{ opacity: 0, x: 50 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            Instant Delivery
          </motion.h2>
          <motion.p 
            className="text-[2.5vw] text-text-secondary mt-4"
            initial={{ opacity: 0, x: 50 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
          >
            Get your access codes via WhatsApp immediately after purchase.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
