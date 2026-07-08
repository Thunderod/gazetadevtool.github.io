import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;
      try {
        setIsLoading(true);
        // Added video metrics to the query
        const { data: statsData, error } = await supabase
          .from('daily_stats')
          .select('date, requests, impressions, clicks, video_start, video_25_percent, video_50_percent, video_75_percent, video_complete')
          .order('date', { ascending: true })
          .limit(30);

        if (error) throw error;

        const grouped = (statsData || []).reduce((acc: any, curr: any) => {
          if (!acc[curr.date]) {
            acc[curr.date] = { 
              date: curr.date, 
              requests: 0, 
              impressions: 0, 
              clicks: 0,
              video_start: 0,
              video_25_percent: 0,
              video_50_percent: 0,
              video_75_percent: 0,
              video_complete: 0
            };
          }
          acc[curr.date].requests += curr.requests || 0;
          acc[curr.date].impressions += curr.impressions || 0;
          acc[curr.date].clicks += curr.clicks || 0;
          acc[curr.date].video_start += curr.video_start || 0;
          acc[curr.date].video_25_percent += curr.video_25_percent || 0;
          acc[curr.date].video_50_percent += curr.video_50_percent || 0;
          acc[curr.date].video_75_percent += curr.video_75_percent || 0;
          acc[curr.date].video_complete += curr.video_complete || 0;
          return acc;
        }, {});

        const formattedData = Object.values(grouped).map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Performance Analytics</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Deep dive into your monetization metrics and ad performance.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm dark:shadow-zinc-950/50"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Ad Performance & Video Retention</h2>
          <select className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-[400px] w-full flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          ) : data.length === 0 ? (
            <div className="text-center text-zinc-500 dark:text-zinc-400">
              <p>No analytics data available yet.</p>
              <p className="text-sm mt-2">Integrate your app and start serving ads to see stats.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#52525b" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-text)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#114B5F', fontWeight: 500 }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="impressions" name="Impressions" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="clicks" name="Clicks" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="video_start" name="Video Start" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="video_50_percent" name="Video 50%" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="video_complete" name="Video Complete" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
}
