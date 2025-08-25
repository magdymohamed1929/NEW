import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MessageCircle,
  Twitter,
  Instagram,
  LucideIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialLink {
  id: string;
  name: string;
  icon: LucideIcon;
  url: string;
  color: string;
  hoverColor: string;
  bgGradient: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
}

export const SocialMedia3D = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading contact info:', error);
        return;
      }

      if (data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks: SocialLink[] = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      url: contactInfo.github_url || 'https://github.com',
      color: 'text-foreground',
      hoverColor: 'text-primary',
      bgGradient: 'from-primary/20 to-primary/5'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      url: contactInfo.linkedin_url || 'https://linkedin.com',
      color: 'text-foreground',
      hoverColor: 'text-secondary',
      bgGradient: 'from-secondary/20 to-secondary/5'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      url: contactInfo.twitter_url || 'https://twitter.com',
      color: 'text-foreground',
      hoverColor: 'text-accent',
      bgGradient: 'from-accent/20 to-accent/5'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'text-foreground',
      hoverColor: 'text-primary',
      bgGradient: 'from-primary/20 via-secondary/20 to-accent/20'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      url: contactInfo.email ? `mailto:${contactInfo.email}` : 'mailto:contact@example.com',
      color: 'text-foreground',
      hoverColor: 'text-secondary',
      bgGradient: 'from-secondary/20 to-secondary/5'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      url: contactInfo.phone ? `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/1234567890',
      color: 'text-foreground',
      hoverColor: 'text-accent',
      bgGradient: 'from-accent/20 to-accent/5'
    }
  ].filter(link => 
    // Only show links that have valid URLs from the database
    link.id === 'instagram' || // Always show Instagram
    (link.id === 'github' && contactInfo.github_url) ||
    (link.id === 'linkedin' && contactInfo.linkedin_url) ||
    (link.id === 'twitter' && contactInfo.twitter_url) ||
    (link.id === 'email' && contactInfo.email) ||
    (link.id === 'whatsapp' && contactInfo.phone)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          onHoverStart={() => setHoveredLink(link.id)}
          onHoverEnd={() => setHoveredLink(null)}
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: 'easeOut'
          }}
          whileHover={{ 
            y: -8,
            rotateX: 15,
            rotateY: 5,
            scale: 1.1
          }}
          whileTap={{ scale: 0.95 }}
          style={{ perspective: '1000px' }}
        >
          {/* 3D Container */}
          <div className="relative preserve-3d">
            
            {/* Main Card */}
            <motion.div
              className={`
                relative w-16 h-16 rounded-2xl glass border border-glass-border
                flex items-center justify-center cursor-pointer
                transform-gpu preserve-3d transition-all duration-500
                ${hoveredLink === link.id ? 'glow-cyan' : 'hover:glow-purple'}
              `}
              animate={{
                rotateY: hoveredLink === link.id ? 12 : 0,
                z: hoveredLink === link.id ? 20 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Gradient */}
              <div className={`
                absolute inset-0 rounded-2xl bg-gradient-to-br ${link.bgGradient}
                opacity-0 group-hover:opacity-100 transition-opacity duration-500
              `} />
              
              {/* Icon */}
              <link.icon 
                size={28} 
                className={`
                  relative z-10 transition-all duration-300
                  ${hoveredLink === link.id ? link.hoverColor : link.color}
                  ${hoveredLink === link.id ? 'drop-shadow-lg' : ''}
                `} 
              />
              
              {/* Holographic Shine Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0"
                animate={{
                  opacity: hoveredLink === link.id ? [0, 0.6, 0] : 0,
                  x: hoveredLink === link.id ? [-100, 100] : 0
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: hoveredLink === link.id ? Infinity : 0,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            {/* 3D Depth Layer */}
            <motion.div
              className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 -z-10"
              animate={{
                y: hoveredLink === link.id ? 8 : 4,
                z: hoveredLink === link.id ? -10 : -5,
                opacity: hoveredLink === link.id ? 0.8 : 0.4
              }}
              transition={{ duration: 0.3 }}
              style={{
                transform: 'translateZ(-10px) scale(0.95)',
                filter: 'blur(1px)'
              }}
            />

            {/* Floating Particles */}
            {hoveredLink === link.id && (
              <>
                {Array.from({ length: 6 }).map((_, particleIndex) => (
                  <motion.div
                    key={particleIndex}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -30, -60],
                      x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: particleIndex * 0.1,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </>
            )}

            {/* Pulse Ring */}
            {hoveredLink === link.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: [1, 1.5, 2], 
                  opacity: [0.8, 0.3, 0] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            )}

            {/* Label */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: hoveredLink === link.id ? 1 : 0,
                y: hoveredLink === link.id ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 py-1 glass rounded-lg border border-glass-border">
                <span className="text-xs font-inter font-medium text-foreground">
                  {link.name}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Connection Line to center */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-px h-12 bg-gradient-to-t from-primary/30 to-transparent origin-bottom -z-20"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: hoveredLink === link.id ? 1 : 0,
              opacity: hoveredLink === link.id ? 0.6 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{
              transform: 'translate(-50%, -50%) rotateX(90deg) translateZ(-20px)'
            }}
          />
        </motion.a>
      ))}
    </div>
  );
};