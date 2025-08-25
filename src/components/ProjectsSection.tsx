import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

interface Project {
  id: string;
  title: string;
  title_ar?: string | null;
  description: string;
  description_ar?: string | null;
  tech: string[];
  icon: string;
  color: string;
  glow_class: string;
  live_demo_url?: string;
  github_url?: string;
}

export const ProjectsSection = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to empty array if there's an error
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Zap;
  };

  return (
    <section ref={ref} className="relative min-h-screen py-20 snap-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            {t('projects.title')}
          </h2>
          <p className="font-inter text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glass rounded-2xl p-8 h-96 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mb-6"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-6"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 w-20 bg-muted rounded-full"></div>
                </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">{t('projects.empty')}</p>
            </div>
          ) : (
            projects.map((project, index) => {
              const IconComponent = getIconComponent(project.icon);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 100, rotateX: -15 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: 'easeOut'
                  }}
                  onHoverStart={() => setHoveredProject(parseInt(project.id))}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group relative perspective-1000"
                >
                  <div className={`
                    glass rounded-2xl p-8 h-full transition-all duration-500 cursor-pointer
                    ${hoveredProject === parseInt(project.id) ? project.glow_class : 'hover:glow-cyan'}
                    ${hoveredProject === parseInt(project.id) ? 'transform -translate-y-4 rotate-y-12' : ''}
                  `}>
                    {/* Holographic Background */}
                    <div className="absolute inset-0 holographic opacity-10 rounded-2xl" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`
                        w-16 h-16 rounded-full bg-gradient-to-br ${project.color} 
                        flex items-center justify-center mb-6 ${project.glow_class}
                        transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12
                      `}>
                        <IconComponent size={32} className="text-background" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-orbitron text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                        { (i18n.language === 'ar' && project.title_ar) ? project.title_ar : project.title }
                      </h3>
                      
                      {/* Description */}
                      <p className="font-inter text-muted-foreground mb-6 leading-relaxed">
                        { (i18n.language === 'ar' && project.description_ar) ? project.description_ar : project.description }
                      </p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-muted rounded-full text-xs font-inter font-medium text-muted-foreground border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button 
                          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-inter font-medium text-primary-foreground hover:glow-cyan transition-all duration-300 transform hover:scale-105"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <Eye size={16} />
                          <span>{t('projects.details')}</span>
                        </button>
                        
                        {project.live_demo_url && (
                          <button 
                            className="flex items-center space-x-2 px-3 py-2 glass border border-glass-border rounded-lg font-inter font-medium text-foreground hover:border-primary hover:glow-cyan transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.live_demo_url, '_blank');
                            }}
                          >
                            <ExternalLink size={16} />
                          </button>
                        )}
                        
                        {project.github_url && (
                          <button 
                            className="flex items-center space-x-2 px-3 py-2 glass border border-glass-border rounded-lg font-inter font-medium text-foreground hover:border-primary hover:glow-cyan transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.github_url, '_blank');
                            }}
                          >
                            <Github size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Floating Particles */}
                    {Array.from({ length: 3 }).map((_, particleIndex) => (
                      <motion.div
                        key={particleIndex}
                        className={`absolute w-1 h-1 bg-${project.color.includes('primary') ? 'primary' : project.color.includes('secondary') ? 'secondary' : 'accent'} rounded-full opacity-60`}
                        style={{
                          top: `${20 + particleIndex * 25}%`,
                          right: `${10 + particleIndex * 15}%`
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: particleIndex * 0.5,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};