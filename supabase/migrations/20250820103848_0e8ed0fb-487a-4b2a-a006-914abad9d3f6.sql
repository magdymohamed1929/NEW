-- Fix the search path security issue
ALTER FUNCTION public.verify_admin_credentials(TEXT, TEXT) SET search_path = public;

-- Update the admin account with the actual password for Magdy
UPDATE public.admin_accounts 
SET password_hash = 'Magdy@admin@2010' 
WHERE username = 'Magdy';