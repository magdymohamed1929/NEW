import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Code, Zap, Globe, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [personalInfo, setPersonalInfo] = useState<{
    id: string;
    name: string | null;
    title: string | null;
    bio: string | null;
    profile_image_url: string | null;
    resume_url: string | null;
  } | null>(null);
  
  const skills = [
    { icon: Code, name: t('about.skills.fullStack'), level: 95 },
    { icon: Zap, name: t('about.skills.performance'), level: 90 },
    { icon: Globe, name: t('about.skills.web'), level: 98 },
    { icon: Cpu, name: t('about.skills.architecture'), level: 85 }
  ];

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .single();

        if (!error && data) {
          setPersonalInfo(data);
        }
      } catch (err) {
        // fail silently on about; keep static fallback
        console.error('Error loading personal info:', err);
      }
    };
    loadPersonalInfo();
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center py-20 snap-section">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Floating Holographic Card */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="glass rounded-2xl p-8 glow-cyan floating relative overflow-hidden">
              {/* Holographic Effect */}
              <div className="absolute inset-0 holographic opacity-20 rounded-2xl" />
              
              {/* Avatar / Profile */}
              <div className="relative z-10">
                <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 glow-purple">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    {personalInfo?.profile_image_url ? (
                      <img
                        src={personalInfo.profile_image_url}
                        alt={personalInfo.name ?? 'Profile'}
                        className="w-48 h-48 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Code size={80} className="text-primary glow-cyan" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-orbitron text-2xl font-bold text-foreground mb-2">
                    {personalInfo?.title || 'Digital Innovator'}
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    {personalInfo?.name || 'Pushing the boundaries of technology'}
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-8 h-8 border border-primary rounded-full opacity-60"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-4 -left-4 w-6 h-6 border border-secondary rounded-full opacity-40"
              />
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
              {t('about.title')}
            </h2>
            
            <div className="space-y-6 text-foreground/90 font-inter text-lg leading-relaxed">
              {personalInfo?.bio ? (
                <p>{personalInfo.bio}</p>
              ) : (
                <>
                  <p>
                    {t('about.description1')}
                  </p>
                  
                  <p>
                    {t('about.description2')}
                  </p>
                  
                  <p>
                    {t('about.description3')}
                  </p>
                </>
              )}
              {personalInfo?.resume_url && (
                <div>
                  <a
                    href={personalInfo.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 underline text-primary hover:text-secondary"
                  >
                    {t('about.viewResume')}
                  </a>
                </div>
              )}
            </div>
            
            {/* Skills */}
            <div className="mt-12 space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <skill.icon className="text-primary group-hover:text-secondary transition-colors duration-300" size={24} />
                      <span className="font-inter font-medium text-foreground">{skill.name}</span>
                    </div>
                    <span className="text-muted-foreground font-orbitron text-sm">{skill.level}%</span>
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full glow-cyan"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};