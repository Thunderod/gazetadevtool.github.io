import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Eye, Smartphone, MousePointerClick, X, Activity, CheckSquare, Zap, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        // Fetch Apps
        const { data: appsData } = await supabase
          .from('apps')
          .select('*')
          .eq('developer_id', user.id)
          .order('created_at', { ascending: false });
        
        if (appsData) setApps(appsData);

        // Fetch Stats
        if (appsData && appsData.length > 0) {
          const appIds = appsData.map(a => a.id);
          
          const { data: statsData } = await supabase
            .from('daily_stats')
            .select('*')
            .in('app_id', appIds)
            .order('date', { ascending: true });
            
          if (statsData) setDailyStats(statsData);
        }
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Calculate real metrics
  const totalImpressions = dailyStats.reduce((sum, row) => sum + (row.impressions || 0), 0);
  const totalRequests = dailyStats.reduce((sum, row) => sum + (row.requests || 0), 0);
  const fillRate = totalRequests > 0 ? (totalImpressions / totalRequests) * 100 : 0;
  
  // Calculate mock revenue based on $3.50 eCPM
  const estimatedRevenue = (totalImpressions / 1000) * 3.50;

  // Group by date for chart
  const chartDataMap = dailyStats.reduce((acc, row) => {
    const dateStr = new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[dateStr]) acc[dateStr] = { name: dateStr, revenue: 0 };
    acc[dateStr].revenue += (row.impressions || 0) / 1000 * 3.50;
    return acc;
  }, {} as Record<string, any>);
  
  const chartData = Object.values(chartDataMap);
  if (chartData.length === 0) {
    // Dummy empty chart data if no stats exist
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
      chartData.push({ name: day, revenue: 0 });
    });
  }

  const stats = [
    { name: 'Daily Revenue', value: `$${estimatedRevenue.toFixed(2)}`, change: '+0.0%', changeType: 'neutral', icon: DollarSign, isPrimary: true },
    { name: 'Impressions', value: totalImpressions.toLocaleString(), change: '+0.0%', changeType: 'neutral', icon: Eye },
    { name: 'eCPM Average', value: '$3.50', change: '—', changeType: 'neutral', icon: MousePointerClick },
    { name: 'Fill Rate', value: `${fillRate.toFixed(1)}%`, change: '—', changeType: 'neutral', icon: Smartphone },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      
      {/* MAIN COLUMN */}
      <div className={`flex-1 space-y-8 ${showActivity ? 'lg:max-w-[calc(100%-350px)]' : ''} transition-all duration-300`}>
        
        {/* Toggle Activity Sidebar Button (Mobile/Desktop) */}
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Overview</h2>
          <button 
            onClick={() => setShowActivity(!showActivity)}
            className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-lg"
          >
            <Activity className="h-4 w-4" />
            {showActivity ? 'Hide Insights' : 'Show Insights'}
          </button>
        </div>

        {!showActivity && (
          <div className="hidden lg:flex justify-end mb-[-1rem]">
            <button 
              onClick={() => setShowActivity(true)}
              className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
            >
              <Activity className="h-4 w-4" />
              Show Insights Sidebar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.name} 
              className={`p-6 rounded-3xl border shadow-sm transition-colors ${
                stat.isPrimary 
                  ? 'bg-brand-50 dark:bg-brand-900/40 border-brand-200 dark:border-brand-700/50' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                stat.isPrimary ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {stat.name}
              </p>
              <div className="flex items-end justify-between">
                <h3 className={`text-2xl sm:text-3xl font-light ${
                  stat.isPrimary ? 'text-brand-700 dark:text-brand-100 font-medium' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {stat.value}
                </h3>
                {stat.changeType !== 'neutral' ? (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    stat.changeType === 'positive' 
                      ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                    {stat.change}
                  </span>
                ) : (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    stat.isPrimary ? 'text-brand-600 bg-brand-100/50 dark:bg-brand-800/50 dark:text-brand-300' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Revenue Flow (7 Days)</h4>
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-brand-500"></span>
              <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#114B5F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#114B5F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-text)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#114B5F', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#114B5F" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <h4 className="font-semibold mb-6 text-slate-900 dark:text-slate-100">Active Inventory</h4>
          <div className="space-y-4">
            {apps.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No apps created yet. Create one to get started.
              </div>
            )}
            {apps.map(app => (
              <div key={app.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-lg mr-4 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{app.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{app.platform} • {app.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold gap-4">
          <div className="flex space-x-3 sm:space-x-6 flex-wrap justify-center sm:justify-start gap-y-2">
            <span>SDK Version 4.2.1-stable</span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span>Supabase Auth: Encrypted</span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span>Creative CDN: Edge Optimized</span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400 shrink-0">
            <CheckSquare className="h-3 w-3 text-emerald-500 mr-2" />
            System Operational
          </div>
        </footer>
      </div>

      {/* RIGHT SIDEBAR (ACTIVITY & INSIGHTS) */}
      {showActivity && (
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <button 
              onClick={() => setShowActivity(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-500" />
              Activity & Insights
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">New App Created</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">"{apps[0]?.name || 'App'}" has been successfully registered.</p>
                  <span className="text-[10px] font-medium text-brand-600 dark:text-brand-400 mt-2 block">Just now</span>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">System: Edge Optimized</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Creative CDN cache purged and optimized for low latency.</p>
                  <span className="text-[10px] font-medium text-slate-400 mt-2 block">45m ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Integration Tasks</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-brand-500 bg-brand-500 text-white mt-0.5">
                  <CheckSquare className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-through opacity-70">Integrate SDK version 4.2.1</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-brand-400 mt-0.5 transition-colors"></div>
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Configure Supabase Auth webhooks</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-brand-400 mt-0.5 transition-colors"></div>
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Review GDPR compliance settings</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 rounded-3xl p-6">
            <h3 className="font-bold text-brand-900 dark:text-brand-100 mb-2 text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-500" />
              Performance Insight
            </h3>
            <p className="text-xs text-brand-700 dark:text-brand-300 leading-relaxed">
              Your overall Fill Rate is up <strong className="font-bold">3%</strong> compared to last week. Try adding a new Ad Unit to capture more inventory!
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
