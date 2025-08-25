import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

interface RocketLaunchProps {
  scrollProgress: number;
}

export const RocketLaunch = ({ scrollProgress }: RocketLaunchProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (scrollProgress > 0.1) {
      setIsVisible(true);
    }
  }, [scrollProgress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <motion.div
        className="absolute left-1/2 top-1/2"
        initial={{ 
          x: '-50%', 
          y: '50%', 
          scale: 0.5, 
          opacity: 0,
          rotate: 0 
        }}
        animate={{
          x: '-50%',
          y: `-${scrollProgress * 150}%`,
          scale: Math.max(0.3, 1 - scrollProgress * 0.7),
          opacity: Math.max(0, 1 - scrollProgress * 1.2),
          rotate: scrollProgress * 360
        }}
        transition={{
          duration: 0.1,
          ease: 'easeOut'
        }}
      >
        <div className="relative">
          {/* Rocket Body */}
          <div className="relative">
            <Rocket 
              size={60} 
              className="text-primary glow-cyan animate-pulse-glow" 
            />
            
            {/* Rocket Trail */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: scrollProgress * 200,
                opacity: scrollProgress > 0.2 ? 0.8 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 bg-gradient-to-b from-primary via-secondary to-accent opacity-80 blur-sm animate-pulse" />
              <div className="absolute inset-0 w-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-primary-glow to-transparent blur-xs" />
            </motion.div>

            {/* Exhaust Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 40}%`,
                  bottom: '-20px'
                }}
                animate={{
                  y: [0, -100, -200],
                  opacity: [1, 0.5, 0],
                  scale: [1, 0.5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};