import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote, Twitter, Linkedin, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  position?: string | null;
  company?: string | null;
  content: string;
  rating: number | null;
  image_url?: string | null;
  platform?: string | null;
  created_at: string;
}

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setErrorMessage(null);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading testimonials:', error);
        setErrorMessage(error.message);
        return;
      }

      const normalized = (data || []).map((t) => ({
        ...t,
        platform: (t.platform || 'website'),
        rating: (t.rating ?? 5),
      }));

      console.log('Loaded testimonials:', normalized);
      setTestimonials(normalized);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setErrorMessage('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform?: string | null) => {
    switch ((platform || 'website').toLowerCase()) {
      case 'twitter':
        return <Twitter size={16} className="text-blue-400" />;
      case 'linkedin':
        return <Linkedin size={16} className="text-blue-600" />;
      default:
        return <Globe size={16} className="text-primary" />;
    }
  };

  const getDefaultAvatar = (platform?: string | null) => {
    switch ((platform || 'website').toLowerCase()) {
      case 'twitter':
        return '/api/placeholder/40/40?text=T&bg=1DA1F2&color=white';
      case 'linkedin':
        return '/api/placeholder/40/40?text=in&bg=0077B5&color=white';
      default:
        return '/api/placeholder/40/40?text=U&bg=6366F1&color=white';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}
      />
    ));
  };

  if (loading || testimonials.length === 0) {
    return (
      <section ref={ref} className="relative min-h-[40vh] py-20 snap-section">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-orbitron text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            {t('testimonials.title', { defaultValue: 'Testimonials' })}
          </h2>
          <p className="font-inter text-muted-foreground">
            {errorMessage ? `${t('testimonials.loadError')}: ${errorMessage}` : t('testimonials.empty')}
          </p>
        </div>
      </section>
    );
  }

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
            {t('testimonials.title')}
          </h2>
          <p className="font-inter text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: 'easeOut' 
              }}
              className="glass rounded-2xl p-6 glow-cyan hover:glow-purple transition-all duration-500 group relative overflow-hidden"
            >
              {/* Holographic Background */}
              <div className="absolute inset-0 holographic opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl" />
              
              {/* Quote Icon */}
              <div className="relative z-10 mb-4">
                <Quote className="text-primary opacity-60" size={24} />
              </div>

              {/* Rating */}
              <div className="relative z-10 flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <div className="relative z-10 mb-6">
                <p className="font-inter text-foreground/90 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="relative z-10 flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={testimonial.image_url || getDefaultAvatar(testimonial.platform)}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {getPlatformIcon(testimonial.platform)}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-orbitron font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  {(testimonial.position || testimonial.company) && (
                    <p className="font-inter text-sm text-muted-foreground">
                      {testimonial.position}
                      {testimonial.position && testimonial.company && ' '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-60"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};