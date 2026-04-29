
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emojis = ['👌', '🔥', '🎉', '🍾', '🎊', '🚀', '🌍', '💎'];

export const Celebration: React.FC<{ active: boolean; onComplete: () => void }> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: window.innerHeight + 50, x: p.x, opacity: 1, scale: 0.5 }}
            animate={{ 
              y: -100, 
              x: p.x + (Math.random() - 0.5) * 400,
              rotate: 360,
              opacity: 0,
              scale: 1.5
            }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute text-4xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
