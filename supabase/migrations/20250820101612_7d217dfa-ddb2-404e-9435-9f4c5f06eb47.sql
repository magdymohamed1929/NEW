-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT NOT NULL DEFAULT 'Zap',
  color TEXT NOT NULL DEFAULT 'from-primary to-secondary',
  glow_class TEXT NOT NULL DEFAULT 'glow-cyan',
  live_demo_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code2',
  color TEXT NOT NULL DEFAULT 'text-primary',
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  tech TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_info table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access, admin write access)
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view contact info" 
ON public.contact_info 
FOR SELECT 
USING (true);

-- Admin policies (will be restricted once auth is implemented)
CREATE POLICY "Authenticated users can manage projects" 
ON public.projects 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage skills" 
ON public.skills 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact info
INSERT INTO public.contact_info (email, phone, location, linkedin_url, github_url, twitter_url) 
VALUES ('contact@example.com', '+1 (555) 123-4567', 'San Francisco, CA', 'https://linkedin.com/in/username', 'https://github.com/username', 'https://twitter.com/username');

-- Insert sample projects
INSERT INTO public.projects (title, description, tech, icon, color, glow_class, live_demo_url, github_url) VALUES
('Quantum UI Framework', 'Next-generation component library with quantum-inspired animations and holographic effects.', '{"React", "TypeScript", "Framer Motion", "WebGL"}', 'Zap', 'from-primary to-secondary', 'glow-cyan', '#', '#'),
('Neural Network Dashboard', 'Real-time AI model monitoring with 3D data visualizations and predictive analytics.', '{"Vue.js", "D3.js", "Python", "TensorFlow"}', 'Shield', 'from-secondary to-accent', 'glow-purple', '#', '#'),
('Blockchain Explorer', 'Immersive cryptocurrency tracking platform with holographic transaction flows.', '{"Next.js", "Web3", "GraphQL", "Three.js"}', 'Rocket', 'from-accent to-primary', 'glow-magenta', '#', '#');

-- Insert sample skills
INSERT INTO public.skills (name, icon, color, position_x, position_y, tech) VALUES
('Frontend Development', 'Code2', 'text-primary', 0, -120, '{"React", "Vue", "Angular", "TypeScript"}'),
('Backend Development', 'Database', 'text-secondary', 85, -85, '{"Node.js", "Python", "PostgreSQL", "MongoDB"}'),
('UI/UX Design', 'Palette', 'text-accent', 120, 0, '{"Figma", "Adobe XD", "Framer", "Principle"}'),
('Mobile Development', 'Smartphone', 'text-primary', 85, 85, '{"React Native", "Flutter", "Swift", "Kotlin"}'),
('Cloud Services', 'Cloud', 'text-secondary', 0, 120, '{"AWS", "Azure", "GCP", "Docker"}'),
('Cybersecurity', 'Lock', 'text-accent', -85, 85, '{"Encryption", "OAuth", "JWT", "Penetration Testing"}'),
('Performance', 'Zap', 'text-primary', -120, 0, '{"Optimization", "Caching", "CDN", "WebAssembly"}'),
('AI/ML', 'Brain', 'text-secondary', -85, -85, '{"TensorFlow", "PyTorch", "OpenAI", "Computer Vision"}');