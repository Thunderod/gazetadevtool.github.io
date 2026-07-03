export type AppPlatform = 'android' | 'web';
export type AppCategory = 'game' | 'app' | 'website';
export type AdFormat = 'banner' | 'interstitial' | 'rewarded' | 'native';

export interface AppProperty {
  id: string;
  name: string;
  platform: AppPlatform;
  bundle_id: string;
  category: AppCategory;
  genre?: string;
  target_audience?: string;
  created_at: string;
  status: 'active' | 'pending' | 'rejected';
}

export interface AdUnit {
  id: string;
  app_id: string;
  name: string;
  format: AdFormat;
  created_at: string;
  status: 'active' | 'archived';
}

export interface DailyStats {
  date: string;
  requests: number;
  impressions: number;
  clicks: number;
  revenue: number;
}
