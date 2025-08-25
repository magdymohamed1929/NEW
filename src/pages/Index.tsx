import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ParticleSystem } from '@/components/ParticleSystem';
import { RocketLaunch } from '@/components/RocketLaunch';
import { HeroSection } from '@/components/HeroSection';
import { useTranslation } from 'react-i18next';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrolled / maxScroll, 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-8 glow-cyan"
          />
          <motion.h1 className="font-orbitron text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {t('loader.initializing')}
          </motion.h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden smooth-scroll">
      <Navbar />
      <ParticleSystem />
      <RocketLaunch scrollProgress={scrollProgress} />
      
      <div className="fixed inset-0 tech-grid opacity-5 pointer-events-none" />
      <div className="fixed inset-0 holographic opacity-5 pointer-events-none" />
      
      <main className="relative z-20">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;