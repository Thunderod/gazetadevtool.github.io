-- 1. Drop existing tables and policies related to ad_units
DROP POLICY IF EXISTS "Users can view stats for their ad units" ON public.daily_stats;
DROP POLICY IF EXISTS "Users can view their own ad_units" ON public.ad_units;
DROP POLICY IF EXISTS "Users can insert their own ad_units" ON public.ad_units;
DROP POLICY IF EXISTS "Users can update their own ad_units" ON public.ad_units;
DROP POLICY IF EXISTS "Users can delete their own ad_units" ON public.ad_units;

-- Remove foreign key constraint from daily_stats
ALTER TABLE public.daily_stats DROP CONSTRAINT IF EXISTS daily_stats_ad_unit_id_fkey;

-- Drop ad_units table
DROP TABLE IF EXISTS public.ad_units CASCADE;

-- 2. Modify daily_stats to link to apps directly
-- Rename ad_unit_id to app_id
ALTER TABLE public.daily_stats RENAME COLUMN ad_unit_id TO app_id;

-- Add new foreign key constraint
ALTER TABLE public.daily_stats
  ADD CONSTRAINT daily_stats_app_id_fkey 
  FOREIGN KEY (app_id) REFERENCES public.apps(id) ON DELETE CASCADE;

-- Update unique constraint to prevent duplicate dates for the same app
ALTER TABLE public.daily_stats DROP CONSTRAINT IF EXISTS daily_stats_ad_unit_id_date_key;
ALTER TABLE public.daily_stats ADD CONSTRAINT daily_stats_app_id_date_key UNIQUE (app_id, date);

-- Recreate policy for daily_stats
CREATE POLICY "Users can view stats for their apps" ON public.daily_stats FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.apps WHERE apps.id = daily_stats.app_id AND apps.user_id = auth.uid())
);

-- 3. Add ad_formats array to apps table
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS ad_formats TEXT[] DEFAULT '{}';
