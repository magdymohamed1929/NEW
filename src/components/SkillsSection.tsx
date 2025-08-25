import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Code2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  position_x: number;
  position_y: number;
  tech: string[];
}

export const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      // Fallback to empty array if there's an error
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Code2;
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center py-20 snap-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2
            lang="en"
            dir="ltr"
            translate="no"
            className="font-orbitron text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary"
          >
            SKILL MATRIX
          </h2>
          <p
            lang="en" 
            dir="ltr"
            translate="no"
            className="font-inter text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Interactive technology ecosystem showcasing my expertise
          </p>
        </motion.div>
        
        <div className="relative flex items-center justify-center min-h-[600px]">
          {/* Central Core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent glow-cyan animate-pulse-glow flex items-center justify-center">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
                <Code2 size={48} className="text-primary" />
              </div>
            </div>
            
            {/* Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-primary/20 rounded-full scale-150"
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1" />
            </motion.div>
          </motion.div>
          
          {/* Orbiting Skills */}
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="absolute w-20 h-20 rounded-full bg-muted animate-pulse"
                style={{ 
                  left: '50%', 
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${Math.cos(index * 45 * Math.PI / 180) * 120}px, ${Math.sin(index * 45 * Math.PI / 180) * 120}px)`
                }}
              />
            ))
          ) : skills.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                No skills found. Visit the admin panel to add some!
              </p>
            </div>
          ) : (
            skills.map((skill, index) => {
              const IconComponent = getIconComponent(skill.icon);
              return (
                <motion.div
                  key={skill.id}
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={isInView ? {
                    scale: 1,
                    opacity: 1,
                    x: skill.position_x,
                    y: skill.position_y
                  } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8 + index * 0.1,
                    ease: 'easeOut'
                  }}
                  onHoverStart={() => setHoveredSkill(skill.id)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  className="absolute cursor-pointer group"
                  style={{ 
                    left: '50%', 
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`
                    relative w-20 h-20 rounded-full glass border-2 border-glass-border
                    flex items-center justify-center transition-all duration-500
                    ${hoveredSkill === skill.id ? 'glow-cyan scale-125 border-primary' : 'hover:glow-purple hover:scale-110'}
                  `}>
                    <IconComponent 
                      size={32} 
                      className={`${skill.color} transition-colors duration-300 group-hover:text-primary`} 
                    />
                    
                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={hoveredSkill === skill.id ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-4 bg-card border border-card-border rounded-lg p-4 min-w-48 z-20"
                    >
                      <h4 className="font-orbitron font-semibold text-foreground mb-2">{skill.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-muted rounded text-xs font-inter text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-card-border rotate-45" />
                    </motion.div>
                  </div>
                  
                  {/* Connection Line */}
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                    transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                    className="absolute top-1/2 left-1/2 origin-center pointer-events-none"
                    style={{
                      width: Math.sqrt(skill.position_x ** 2 + skill.position_y ** 2),
                      transform: `translate(-50%, -50%) rotate(${Math.atan2(skill.position_y, skill.position_x) * (180 / Math.PI)}deg)`
                    }}
                  >
                    <div className="h-px bg-gradient-to-r from-primary/50 to-transparent" />
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};