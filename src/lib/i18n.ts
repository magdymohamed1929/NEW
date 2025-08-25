import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      common: {
        admin: "Admin"
      },
      // Navigation
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects", 
        skills: "Skills",
        testimonials: "Testimonials",
        contact: "Contact"
      },
      // Hero Section
      hero: {
        name: "Magdy Elboushy",
        title: "Futuristic Developer & Digital Architect",
        description: "Crafting next-generation digital experiences with cutting-edge technology and innovative design solutions.",
        exploreProjects: "EXPLORE PROJECTS",
        downloadResume: "Download Resume"
      },
      // About Section
      about: {
        title: "ABOUT ME",
        digitalInnovator: "Digital Innovator",
        subtitle: "Pushing the boundaries of technology",
        description1: "I am a passionate developer who specializes in creating futuristic digital experiences that blend cutting-edge technology with intuitive design.",
        description2: "With expertise spanning from front-end frameworks to backend architectures, I craft solutions that are not just functional, but truly extraordinary.",
        description3: "My mission is to push the boundaries of what's possible in web development, creating applications that feel like they're from the future.",
        skills: {
          fullStack: "Full-Stack Development",
          performance: "Performance Optimization", 
          web: "Web Technologies",
          architecture: "System Architecture"
        },
        viewResume: "View Resume"
      },
      // Projects Section
      projects: {
        title: "FEATURED PROJECTS",
        subtitle: "Explore my collection of futuristic applications and digital experiences",
        quantum: {
          title: "Quantum UI Framework",
          description: "Next-generation component library with quantum-inspired animations and holographic effects."
        },
        neural: {
          title: "Neural Network Dashboard", 
          description: "Real-time AI model monitoring with 3D data visualizations and predictive analytics."
        },
        blockchain: {
          title: "Blockchain Explorer",
          description: "Immersive cryptocurrency tracking platform with holographic transaction flows."
        },
        liveDemo: "Live Demo",
        code: "Code",
        details: "Details",
        empty: "No projects found. Visit the admin panel to add some!"
      },
      // Skills Section
      skills: {
        title: "SKILL MATRIX",
        subtitle: "Interactive technology ecosystem showcasing my expertise",
        frontend: "Frontend Development",
        backend: "Backend Development", 
        design: "UI/UX Design",
        mobile: "Mobile Development",
        cloud: "Cloud Services",
        security: "Cybersecurity",
        performance: "Performance",
        ai: "AI/ML"
      },
      // Contact Section
      contact: {
        title: "INITIATE CONTACT",
        description1: "Ready to create something extraordinary? Let's collaborate on your next futuristic project.",
        description2: "Whether you need a complete digital transformation or want to enhance your existing systems with cutting-edge technology, I'm here to help bring your vision to life.",
        quickMessage: "Quick Message",
        yourName: "Your Name",
        yourEmail: "Your Email",
        yourMessage: "Your Message",
        transmitMessage: "TRANSMIT MESSAGE",
        sending: "SENDING...",
        communicationHub: "Communication Hub",
        selectChannel: "Select your preferred transmission channel",
        status: "STATUS: ONLINE",
        responseTime: "RESPONSE_TIME: < 24H"
      },
      // Footer
      footer: {
        copyright: "© 2024 Alex Nova. Crafted with futuristic technology.",
        systemStatus: "SYSTEM_STATUS: ONLINE"
      },
      // Testimonials Section
      testimonials: {
        title: "CLIENT TESTIMONIALS",
        subtitle: "What clients say about my work and digital solutions",
        empty: "No testimonials yet.",
        loadError: "Could not load testimonials"
      },
      // Loader
      loader: {
        initializing: "INITIALIZING SYSTEMS"
      },
      // Project Detail Page
      projectDetail: {
        backToHome: "Back to Home",
        backToProjects: "Back to Projects",
        projectNotFound: "Project not found",
        gallery: "Gallery",
        aboutThisProject: "About This Project",
        keyFeatures: "Key Features",
        advantages: "Advantages",
        challenges: "Challenges",
        technologiesUsed: "Technologies Used"
      },
      // Admin Panel
      admin: {
        testimonials: "Testimonials",
        personalInfo: "Personal Info",
        addTestimonial: "Add Testimonial",
        manageTestimonials: "Manage Testimonials",
        personalInformation: "Personal Information",
        updateProfile: "Update your profile information and resume"
      },
      // Theme & Language
      theme: {
        light: "Light Mode",
        dark: "Dark Mode"
      },
      language: {
        english: "English",
        arabic: "العربية"
      }
    }
  },
  ar: {
    translation: {
      // Common - Arabic
      common: {
        admin: "لوحة الإدارة"
      },
      // Navigation - Arabic
      nav: {
        home: "الرئيسية",
        about: "نبذة",
        projects: "المشاريع",
        skills: "المهارات", 
        testimonials: "الشهادات",
        contact: "التواصل"
      },
      // Hero Section - Arabic
      hero: {
        name: "مجدي البوشي",
        title: "مطور مستقبلي ومعماري رقمي",
        description: "صناعة تجارب رقمية من الجيل القادم باستخدام التكنولوجيا المتطورة وحلول التصميم المبتكرة.",
        exploreProjects: "استكشاف المشاريع",
        downloadResume: "تحميل السيرة الذاتية"
      },
      // About Section - Arabic
      about: {
        title: "نبذة عني",
        digitalInnovator: "مبتكر رقمي",
        subtitle: "دفع حدود التكنولوجيا",
        description1: "أنا مطور شغوف متخصص في إنشاء تجارب رقمية مستقبلية تمزج بين التكنولوجيا المتطورة والتصميم البديهي.",
        description2: "مع خبرة تمتد من أطر العمل الأمامية إلى معماريات الخلفية، أصنع حلولاً ليست فقط وظيفية، بل استثنائية حقاً.",
        description3: "مهمتي هي دفع حدود ما هو ممكن في تطوير الويب، وإنشاء تطبيقات تبدو وكأنها من المستقبل.",
        skills: {
          fullStack: "تطوير الشامل",
          performance: "تحسين الأداء",
          web: "تقنيات الويب", 
          architecture: "معمارية النظام"
        },
        viewResume: "عرض السيرة الذاتية"
      },
      // Projects Section - Arabic
      projects: {
        title: "المشاريع المميزة",
        subtitle: "استكشف مجموعتي من التطبيقات المستقبلية والتجارب الرقمية",
        quantum: {
          title: "إطار عمل كمي واجهة المستخدم",
          description: "مكتبة مكونات من الجيل القادم مع رسوم متحركة مستوحاة من الكم وتأثيرات هولوغرافية."
        },
        neural: {
          title: "لوحة الشبكة العصبية",
          description: "مراقبة نماذج الذكاء الاصطناعي في الوقت الفعلي مع تصورات بيانات ثلاثية الأبعاد وتحليلات تنبؤية."
        },
        blockchain: {
          title: "مستكشف البلوك تشين",
          description: "منصة تتبع العملات المشفرة الغامرة مع تدفقات المعاملات الهولوغرافية."
        },
        liveDemo: "عرض مباشر",
        code: "الكود",
        details: "تفاصيل",
        empty: "لا توجد مشاريع. قم بزيارة لوحة الإدارة لإضافة بعض المشاريع!"
      },
      // Skills Section - Arabic
      skills: {
        title: "مصفوفة المهارات",
        subtitle: "نظام تكنولوجي تفاعلي يعرض خبرتي",
        frontend: "تطوير الواجهة الأمامية",
        backend: "تطوير الخلفية",
        design: "تصميم واجهة المستخدم/تجربة المستخدم",
        mobile: "تطوير الهاتف المحمول",
        cloud: "الخدمات السحابية",
        security: "الأمن السيبراني",
        performance: "الأداء",
        ai: "الذكاء الاصطناعي/تعلم الآلة"
      },
      // Contact Section - Arabic
      contact: {
        title: "بدء التواصل",
        description1: "مستعد لإنشاء شيء استثنائي؟ دعنا نتعاون في مشروعك المستقبلي القادم.",
        description2: "سواء كنت تحتاج إلى تحول رقمي كامل أو تريد تعزيز أنظمتك الحالية بالتكنولوجيا المتطورة، أنا هنا لمساعدتك في تحقيق رؤيتك.",
        quickMessage: "رسالة سريعة",
        yourName: "اسمك",
        yourEmail: "بريدك الإلكتروني",
        yourMessage: "رسالتك",
        transmitMessage: "إرسال الرسالة",
        sending: "جاري الإرسال...",
        communicationHub: "مركز الاتصالات",
        selectChannel: "اختر قناة الإرسال المفضلة لديك",
        status: "الحالة: متصل",
        responseTime: "وقت_الاستجابة: < 24ساعة"
      },
      // Footer - Arabic
      footer: {
        copyright: "© 2024 أليكس نوفا. صُنع بالتكنولوجيا المستقبلية.",
        systemStatus: "حالة_النظام: متصل"
      },
      // Testimonials Section - Arabic
      testimonials: {
        title: "شهادات العملاء",
        subtitle: "ما يقوله العملاء عن عملي والحلول الرقمية",
        empty: "لا توجد شهادات حتى الآن.",
        loadError: "تعذر تحميل الشهادات"
      },
      // Loader - Arabic
      loader: {
        initializing: "جارٍ تهيئة الأنظمة"
      },
      // Project Detail - Arabic
      projectDetail: {
        backToHome: "العودة إلى الصفحة الرئيسية",
        backToProjects: "العودة إلى المشاريع",
        projectNotFound: "المشروع غير موجود",
        gallery: "المعرض",
        aboutThisProject: "نبذة عن المشروع",
        keyFeatures: "أهم الميزات",
        advantages: "المزايا",
        challenges: "التحديات",
        technologiesUsed: "التقنيات المستخدمة"
      },
      // Admin Panel - Arabic
      admin: {
        testimonials: "الشهادات",
        personalInfo: "المعلومات الشخصية",
        addTestimonial: "إضافة شهادة",
        manageTestimonials: "إدارة الشهادات",
        personalInformation: "المعلومات الشخصية",
        updateProfile: "تحديث معلومات الملف الشخصي والسيرة الذاتية"
      },
      // Theme & Language - Arabic
      theme: {
        light: "الوضع المضيء",
        dark: "الوضع المظلم"
      },
      language: {
        english: "English",
        arabic: "العربية"
      }
    }
  }
};

// Initialize with Arabic defaults; Navbar toggle will still switch dynamically
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;