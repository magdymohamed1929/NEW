-- Add new columns to projects table for detailed project pages
ALTER TABLE public.projects 
ADD COLUMN detailed_description TEXT,
ADD COLUMN images TEXT[] DEFAULT '{}',
ADD COLUMN advantages TEXT[] DEFAULT '{}',
ADD COLUMN disadvantages TEXT[] DEFAULT '{}',
ADD COLUMN features TEXT[] DEFAULT '{}',
ADD COLUMN technologies_used TEXT[] DEFAULT '{}';

-- Add index for better performance when querying by id
CREATE INDEX IF NOT EXISTS idx_projects_id ON public.projects(id);