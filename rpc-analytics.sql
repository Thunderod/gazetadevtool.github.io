-- 1. Alter daily_stats to add video metrics
ALTER TABLE public.daily_stats 
ADD COLUMN IF NOT EXISTS video_start INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_25_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_50_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_75_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_complete INTEGER DEFAULT 0;

-- 2. Create a function to atomically increment daily stats including video
CREATE OR REPLACE FUNCTION increment_daily_stat(p_app_id UUID, p_stat_type TEXT)
RETURNS void AS $$
DECLARE
  v_date DATE := CURRENT_DATE;
BEGIN
  INSERT INTO public.daily_stats (app_id, date, requests, impressions, clicks, video_start, video_25_percent, video_50_percent, video_75_percent, video_complete)
  VALUES (
    p_app_id, 
    v_date, 
    CASE WHEN p_stat_type = 'request' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'impression' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'click' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'video_start' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'video_25_percent' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'video_50_percent' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'video_75_percent' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'video_complete' THEN 1 ELSE 0 END
  )
  ON CONFLICT (app_id, date)
  DO UPDATE SET
    requests = public.daily_stats.requests + CASE WHEN p_stat_type = 'request' THEN 1 ELSE 0 END,
    impressions = public.daily_stats.impressions + CASE WHEN p_stat_type = 'impression' THEN 1 ELSE 0 END,
    clicks = public.daily_stats.clicks + CASE WHEN p_stat_type = 'click' THEN 1 ELSE 0 END,
    video_start = public.daily_stats.video_start + CASE WHEN p_stat_type = 'video_start' THEN 1 ELSE 0 END,
    video_25_percent = public.daily_stats.video_25_percent + CASE WHEN p_stat_type = 'video_25_percent' THEN 1 ELSE 0 END,
    video_50_percent = public.daily_stats.video_50_percent + CASE WHEN p_stat_type = 'video_50_percent' THEN 1 ELSE 0 END,
    video_75_percent = public.daily_stats.video_75_percent + CASE WHEN p_stat_type = 'video_75_percent' THEN 1 ELSE 0 END,
    video_complete = public.daily_stats.video_complete + CASE WHEN p_stat_type = 'video_complete' THEN 1 ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
