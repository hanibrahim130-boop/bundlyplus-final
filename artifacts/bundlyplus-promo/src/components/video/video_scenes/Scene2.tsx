import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const services = ['Netflix', 'Spotify', 'ChatGPT Plus', 'YouTube Premium', 'Adobe CC', 'Disney+', 'Canva Pro', 'Midjourney', 'GitHub Copilot'];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-primary"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2 
        className="text-[5vw] font-display font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        50+ Premium Services
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-6 px-12 max-w-6xl">
        {services.map((service, i) => (
          <motion.div
            key={service}
            className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl text-white text-[1.8vw] font-medium"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 + (i * 0.1) }}
          >
            {service}
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-primary/80 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      />
    </motion.div>
  );
}
