-- Drop triggers and functions first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.daily_stats CASCADE;
DROP TABLE IF EXISTS public.ad_units CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create public users table FIRST
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create apps table
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('android', 'web')),
  bundle_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('game', 'app', 'website')),
  genre TEXT,
  target_audience TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad_units table
CREATE TABLE public.ad_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('banner', 'interstitial', 'rewarded', 'native')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_stats table
CREATE TABLE public.daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  requests INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0.00,
  UNIQUE(app_id, date)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Policies for public users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies for apps
CREATE POLICY "Users can view their own apps" ON public.apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own apps" ON public.apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own apps" ON public.apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own apps" ON public.apps FOR DELETE USING (auth.uid() = user_id);

-- Policies for ad_units
CREATE POLICY "Users can view their own ad_units" ON public.ad_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ad_units" ON public.ad_units FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ad_units" ON public.ad_units FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ad_units" ON public.ad_units FOR DELETE USING (auth.uid() = user_id);

-- Policies for daily_stats
CREATE POLICY "Users can view stats for their apps" ON public.daily_stats FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.apps WHERE apps.id = daily_stats.app_id AND apps.user_id = auth.uid())
);

-- ==========================================
-- 6. SDK Tracking RPC
-- ==========================================
CREATE OR REPLACE FUNCTION increment_daily_stat(p_app_id UUID, p_stat_type TEXT)
RETURNS void AS $$
BEGIN
  -- We assume 0.01 ETB revenue per impression, and 0.50 ETB revenue per click for the publisher
  INSERT INTO public.daily_stats (app_id, date, requests, impressions, clicks, revenue)
  VALUES (
    p_app_id, 
    CURRENT_DATE, 
    CASE WHEN p_stat_type = 'request' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'impression' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'click' THEN 1 ELSE 0 END,
    CASE 
      WHEN p_stat_type = 'impression' THEN 0.01
      WHEN p_stat_type = 'click' THEN 0.50
      ELSE 0
    END
  )
  ON CONFLICT (app_id, date) DO UPDATE SET
    requests = daily_stats.requests + EXCLUDED.requests,
    impressions = daily_stats.impressions + EXCLUDED.impressions,
    clicks = daily_stats.clicks + EXCLUDED.clicks,
    revenue = daily_stats.revenue + EXCLUDED.revenue;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
