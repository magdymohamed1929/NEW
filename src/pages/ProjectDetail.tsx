import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Check, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  title_ar?: string | null;
  description: string;
  description_ar?: string | null;
  detailed_description?: string;
  detailed_description_ar?: string | null;
  tech: string[];
  images?: string[];
  advantages?: string[];
  disadvantages?: string[];
  features?: string[];
  technologies_used?: string[];
  icon: string;
  color: string;
  glow_class: string;
  live_demo_url?: string;
  github_url?: string;
  created_at: string;
}

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Zap;
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!project?.images || selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + project.images.length) % project.images.length
      : (selectedImageIndex + 1) % project.images.length;
    
    setSelectedImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-orbitron mb-4">{t('projectDetail.projectNotFound')}</h1>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('projectDetail.backToHome')}
        </Button>
      </div>
    );
  }

  const IconComponent = getIconComponent(project.icon);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <Button 
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8 hover:glow-cyan"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('projectDetail.backToProjects')}
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Project Header */}
          <div className="flex items-center mb-8">
            <div className={`
              w-20 h-20 rounded-2xl bg-gradient-to-br ${project.color} 
              flex items-center justify-center mr-6 ${project.glow_class}
            `}>
              <IconComponent size={40} className="text-background" />
            </div>
            <div>
              <h1 className="font-orbitron text-4xl md:text-5xl font-black text-foreground mb-2">
                {(i18n.language === 'ar' && project.title_ar) ? project.title_ar : project.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {(i18n.language === 'ar' && project.description_ar) ? project.description_ar : project.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-12">
            {project.live_demo_url && (
              <Button 
                onClick={() => window.open(project.live_demo_url, '_blank')}
                className="bg-gradient-to-r from-primary to-secondary hover:glow-cyan"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            )}
            {project.github_url && (
              <Button 
                onClick={() => window.open(project.github_url, '_blank')}
                variant="outline"
                className="hover:border-primary hover:glow-cyan"
              >
                <Github className="mr-2 h-4 w-4" />
                View Code
              </Button>
            )}
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-12">
              <h2 className="font-orbitron text-2xl font-bold mb-6">{t('projectDetail.gallery')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl overflow-hidden hover:glow-cyan transition-all duration-300 cursor-pointer group"
                    onClick={() => openImageModal(index)}
                  >
                    <div className="relative">
                      <img 
                        src={image} 
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          {(project.detailed_description || project.detailed_description_ar) && (
            <div className="mb-12">
              <h2 className="font-orbitron text-2xl font-bold mb-6">{t('projectDetail.aboutThisProject')}</h2>
              <div className="glass rounded-xl p-8">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {(i18n.language === 'ar' && project.detailed_description_ar) ? project.detailed_description_ar : project.detailed_description}
                </p>
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-12">
              <h2 className="font-orbitron text-2xl font-bold mb-6">{t('projectDetail.keyFeatures')}</h2>
              <div className="glass rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advantages & Disadvantages */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {project.advantages && project.advantages.length > 0 && (
              <div>
                <h2 className="font-orbitron text-2xl font-bold mb-6 text-green-400">{t('projectDetail.advantages')}</h2>
                <div className="glass rounded-xl p-8">
                  <div className="space-y-4">
                    {project.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
                        <span className="text-muted-foreground">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {project.disadvantages && project.disadvantages.length > 0 && (
              <div>
                <h2 className="font-orbitron text-2xl font-bold mb-6 text-red-400">{t('projectDetail.challenges')}</h2>
                <div className="glass rounded-xl p-8">
                  <div className="space-y-4">
                    {project.disadvantages.map((disadvantage, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <X className="text-red-400 mt-1 flex-shrink-0" size={20} />
                        <span className="text-muted-foreground">{disadvantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="font-orbitron text-2xl font-bold mb-6">{t('projectDetail.technologiesUsed')}</h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
              {project.technologies_used && project.technologies_used.map((tech, index) => (
                <Badge key={`extra-${index}`} variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && project?.images && (
        <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageModal}>
          <DialogContent className="max-w-screen-lg max-h-screen p-0 bg-black/90">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={project.images[selectedImageIndex]}
                alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {project.images.length > 1 && (
                <>
                  <Button
                    onClick={() => navigateImage('prev')}
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <Button
                    onClick={() => navigateImage('next')}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight size={24} />
                  </Button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {project.images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}