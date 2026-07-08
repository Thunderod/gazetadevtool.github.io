-- 1. Create a function to atomically increment daily stats
CREATE OR REPLACE FUNCTION increment_daily_stat(p_app_id UUID, p_stat_type TEXT)
RETURNS void AS $$
DECLARE
  v_date DATE := CURRENT_DATE;
BEGIN
  INSERT INTO public.daily_stats (app_id, date, requests, impressions, clicks)
  VALUES (
    p_app_id, 
    v_date, 
    CASE WHEN p_stat_type = 'request' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'impression' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'click' THEN 1 ELSE 0 END
  )
  ON CONFLICT (app_id, date)
  DO UPDATE SET
    requests = public.daily_stats.requests + CASE WHEN p_stat_type = 'request' THEN 1 ELSE 0 END,
    impressions = public.daily_stats.impressions + CASE WHEN p_stat_type = 'impression' THEN 1 ELSE 0 END,
    clicks = public.daily_stats.clicks + CASE WHEN p_stat_type = 'click' THEN 1 ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
