-- Add Arabic-localized fields to projects table
-- Safe to run multiple times due to IF NOT EXISTS checks

alter table if exists public.projects
  add column if not exists title_ar text,
  add column if not exists description_ar text,
  add column if not exists detailed_description_ar text;

-- Optional: You can also add localized arrays later if needed, e.g. features_ar, advantages_ar


