import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateParticles = () =>
  Array.from({ length: 84 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 84 + Math.random() * 20,
    distance: 100 + Math.random() * 80,
    size: Math.random() * 5 + 1,
    duration: 2.025 + Math.random() * 0.75,
  }));

const BurstEffect = ({ particles }) => (
  <div className="absolute inset-0 pointer-events-none">
    {particles.map((p) => {
      const x = Math.cos((p.angle * Math.PI) / 180) * p.distance;
      const y = Math.sin((p.angle * Math.PI) / 180) * p.distance;

      return (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x, y, opacity: 0, scale: 0 }}
          transition={{ duration: p.duration, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 bg-black rounded-full"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
        />
      );
    })}
  </div>
);

export default function AnimatedSplash() {
  const [isPressed, setIsPressed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const particles = useMemo(generateParticles, [burstKey]);

  const handlePress = () => {
    if (isPressed) {
      setIsPressed(false);
    } else {
      setBurstKey((k) => k + 1);
      setIsPressed(true);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white cursor-pointer touch-none select-none"
      onPointerDown={handlePress}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isPressed ? (
              <motion.img
                key="bean"
                src="/bean-transparent.png"
                alt="Ziarno kawy"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="w-40 h-40 object-contain"
              />
            ) : (
              <motion.div 
                key="result" 
                className="relative w-full h-full flex items-center justify-center"
              >
                <BurstEffect particles={particles} />
                <motion.img
                  src="/fprint-transparent.png"
                  alt="Odcisk palca"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.2, 
                    duration: 1.2,
                    opacity: { duration: 1.2, ease: "easeIn" },
                    scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className="w-40 h-40 object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 h-12 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isPressed ? (
              <motion.span
                key="p"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="text-black font-sans text-[10px] tracking-[0.5em] uppercase"
              >
                naciśnij
              </motion.span>
            ) : (
              <motion.span
                key="f"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="text-black font-sans text-4xl font-extralight lowercase tracking-tighter"
              >
                funcup
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
