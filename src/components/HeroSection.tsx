import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroBg from '@/assets/hero-bg.jpg';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden snap-section">
      {/* 3D Floating Spheres */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-20 h-20 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
              left: `${10 + index * 15}%`,
              top: `${20 + (index % 3) * 30}%`,
              filter: 'blur(40px)'
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5
            }}
          />
        ))}
      </div>
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Holographic Gradient Overlay */}
      <div className="absolute inset-0 holographic opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Name */}
          <motion.h1 
            className="font-orbitron text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent glow-cyan"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {t('hero.name')}
          </motion.h1>
          
          {/* Title */}
          <motion.h2 
            className="font-inter text-2xl md:text-4xl font-light mb-8 text-foreground/90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t('hero.title')}
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            className="font-inter text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {t('hero.description')}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-orbitron font-semibold text-primary-foreground glow-cyan hover:glow-purple transition-all duration-500 transform hover:scale-105">
              <span className="relative z-10">{t('hero.exploreProjects')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
            </button>
            
            <button className="px-8 py-4 glass border border-glass-border rounded-lg font-inter font-medium text-foreground hover:border-primary hover:glow-cyan transition-all duration-500 backdrop-blur-md">
              {t('hero.downloadResume')}
            </button>
          </motion.div>
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full glow-cyan floating"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut' 
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-20 w-6 h-6 bg-secondary rounded-full glow-purple floating"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            delay: 1,
            ease: 'easeInOut' 
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-10 w-3 h-3 bg-accent rounded-full glow-magenta floating"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.4, 1, 0.4] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            delay: 2,
            ease: 'easeInOut' 
          }}
        />
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
        <div className="w-2 h-2 bg-primary rounded-full mx-auto -mt-1 glow-cyan" />
      </motion.div>
    </section>
  );
};