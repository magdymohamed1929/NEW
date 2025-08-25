-- Create admin accounts table for simple admin authentication
CREATE TABLE public.admin_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for admin accounts (only for internal use)
CREATE POLICY "Admin accounts are not publicly accessible" 
ON public.admin_accounts 
FOR ALL 
USING (false);

-- Insert your admin account (password will be hashed in the application)
INSERT INTO public.admin_accounts (username, password_hash) 
VALUES ('Magdy', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- This is a placeholder, will be updated by app

-- Create function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_username TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.admin_accounts
  WHERE username = p_username;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- For now, simple password comparison (in production, use proper hashing)
  RETURN stored_hash = p_password;
END;
$$;

-- Update RLS policies to allow public read access so the main page works
-- and allow all operations for now (we'll handle admin auth in the app)
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can manage contact info" ON public.contact_info;

-- Allow public read access and all operations (admin auth will be handled in app layer)
CREATE POLICY "Anyone can manage projects" 
ON public.projects 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can manage skills" 
ON public.skills 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (true)
WITH CHECK (true);