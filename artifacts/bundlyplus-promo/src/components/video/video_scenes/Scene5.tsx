import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-bg-dark text-white"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center relative z-10">
        <motion.div 
          className="text-[8vw] font-display font-bold tracking-tighter"
          initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.5, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          BundlyPlus
        </motion.div>
        
        <motion.div
          className="mt-6 text-[2.5vw] text-accent font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Subscribe smarter.
        </motion.div>
      </div>
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-primary rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-secondary rounded-full blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
