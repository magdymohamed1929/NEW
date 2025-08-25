import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send,
  Terminal,
  Zap,
  Mail
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { SocialMedia3D } from './SocialMedia3D';
import { supabase } from '@/integrations/supabase/client';

export const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [contactInfo, setContactInfo] = useState<any>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSending(true);

    try {
      // Initialize EmailJS (replace with your actual keys)
      emailjs.init("U_Rqk-GwJZ2Bk_pSe"); // User needs to add this
      
      const result = await emailjs.send(
  "service_iqri645",
  "template_gnqr4ts",
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    time: new Date().toLocaleString(), // لو عايز تعرض وقت الإرسال
    to_email: "your-email@gmail.com"
  }
);


      console.log('Email sent successfully:', result);
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      
      // You could add a toast notification here
      alert('Message sent successfully!');
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center py-20 snap-section">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary">
              {t('contact.title')}
            </h2>
            
            <div className="space-y-6 text-foreground/90 font-inter text-lg leading-relaxed mb-12">
              <p>
                {t('contact.description1')}
              </p>
              
              <p>
                {t('contact.description2')}
              </p>
            </div>
            
            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Terminal className="text-primary" size={24} />
                <span className="font-orbitron font-semibold text-foreground">{t('contact.quickMessage')}</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('contact.yourName')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg font-inter text-foreground placeholder-muted-foreground focus:border-primary focus:glow-cyan transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder={t('contact.yourEmail')}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg font-inter text-foreground placeholder-muted-foreground focus:border-primary focus:glow-cyan transition-all duration-300"
                />
                <textarea
                  placeholder={t('contact.yourMessage')}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg font-inter text-foreground placeholder-muted-foreground focus:border-primary focus:glow-cyan transition-all duration-300 resize-none"
                />
                
                <button 
                  type="submit"
                  disabled={isSending}
                  className="group relative w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-orbitron font-semibold text-primary-foreground glow-cyan hover:glow-purple transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isSending ? <Mail size={20} className="animate-pulse" /> : <Send size={20} />}
                    <span>{isSending ? t('contact.sending') : t('contact.transmitMessage')}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                </button>
              </form>
            </motion.div>
          </motion.div>
          
          {/* Spaceship Console */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="glass rounded-3xl p-8 glow-purple relative overflow-hidden">
              {/* Holographic Background */}
              <div className="absolute inset-0 holographic opacity-20 rounded-3xl" />
              
              {/* Console Header */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="font-orbitron text-sm text-foreground/80">COMMUNICATION_ARRAY.exe</span>
                  </div>
                  <Zap className="text-accent" size={20} />
                </div>
                
                <h3 className="font-orbitron text-2xl font-bold text-foreground mb-2">
                  {t('contact.communicationHub')}
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  {t('contact.selectChannel')}
                </p>
              </div>
              
              {/* 3D Social Media Links */}
              <div className="relative z-10 mb-8">
                <SocialMedia3D />
              </div>
              
              {/* Console Footer */}
              <div className="relative z-10 pt-6 border-t border-border/20">
                <div className="flex items-center justify-between text-xs font-inter text-muted-foreground">
                  <span>{t('contact.status')}</span>
                  <span>{t('contact.responseTime')}</span>
                </div>
              </div>
              
              {/* Floating Elements */}
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
                  style={{
                    top: `${20 + index * 20}%`,
                    right: `${10 + index * 15}%`
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};