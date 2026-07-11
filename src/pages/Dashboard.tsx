import { useState, useEffect } from 'react';
import { DollarSign, Eye, Smartphone, MousePointerClick, Activity, Loader2, ArrowUpRight, Plus, Box, CheckCircle2, Zap, BookOpen, ArrowRight, CreditCard, LayoutTemplate } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl dark:shadow-zinc-950/50">
        <p className="text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500"></span>
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

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
        const { data: appsData } = await supabase.from('apps').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (appsData) setApps(appsData);

        if (appsData && appsData.length > 0) {
          const appIds = appsData.map(a => a.id);
          const { data: statsData } = await supabase.from('daily_stats').select('*').in('app_id', appIds).order('date', { ascending: true });
          if (statsData) setDailyStats(statsData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const totalImpressions = dailyStats.reduce((sum, row) => sum + (row.impressions || 0), 0);
  const totalRequests = dailyStats.reduce((sum, row) => sum + (row.requests || 0), 0);
  const fillRate = totalRequests > 0 ? (totalImpressions / totalRequests) * 100 : 0;
  const estimatedRevenue = (totalImpressions / 1000) * 3.50;

  const chartDataMap = dailyStats.reduce((acc, row) => {
    const dateStr = new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[dateStr]) acc[dateStr] = { name: dateStr, revenue: 0 };
    acc[dateStr].revenue += (row.impressions || 0) / 1000 * 3.50;
    return acc;
  }, {} as Record<string, any>);
  
  const chartData = Object.values(chartDataMap);
  if (chartData.length === 0) {
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
      chartData.push({ name: day, revenue: 0, spark: Math.random() * 10 });
    });
  } else {
    chartData.forEach(d => d.spark = d.revenue + Math.random() * 5);
  }

  const sparklineData = chartData.map(d => ({ value: d.spark }));

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-12">
      
      {/* MAIN COLUMN */}
      <div className={`flex-1 space-y-6 ${showActivity ? 'xl:max-w-[calc(100%-392px)]' : ''} transition-all duration-300 ease-in-out`}>
        
        {/* Header Area */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Overview</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <button 
            onClick={() => setShowActivity(!showActivity)}
            className="xl:hidden flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <Activity className="h-4 w-4" />
            Insights
          </button>
        </div>

        {/* ONBOARDING & QUICK ACTIONS (New Roadmap Feature) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Onboarding Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Get Started</span>
                  <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-[10px] px-2 py-0.5 rounded-full font-bold">2/3 DONE</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Complete your setup</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">You're almost ready to start monetizing. Finish integrating the Gazeta SDK into your application to go live.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 opacity-50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-through">Create publisher account</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-through">Register first application</span>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Integrate Gazeta SDK</span>
                    <a href="/docs" className="ml-auto text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">View Docs &rarr;</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <a href="/apps" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Add New App</h4>
                <p className="text-xs text-zinc-500">Register another platform</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-brand-500 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
            </a>
            
            <a href="/docs" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">SDK Docs</h4>
                <p className="text-xs text-zinc-500">View integration guides</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-brand-500 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
            </a>
            
            <a href="/payouts" className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Payouts</h4>
                <p className="text-xs text-zinc-500">Configure bank details</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-brand-500 transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
            </a>
          </motion.div>
        </div>

        {/* HERO KPI CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-zinc-900 dark:bg-zinc-900/50 border border-zinc-800 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl dark:shadow-zinc-950 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-zinc-800 rounded-xl">
                  <DollarSign className="h-5 w-5 text-brand-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-400">Total Revenue</h3>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-white tracking-tighter">${estimatedRevenue.toFixed(2)}</span>
                <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12.5%
                </span>
              </div>
            </div>
            <div className="w-full md:w-48 h-16 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* SECONDARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { name: 'eCPM Avg', value: '$3.50', icon: MousePointerClick, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { name: 'Fill Rate', value: `${fillRate.toFixed(1)}%`, icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-500/10' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              key={stat.name} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-zinc-950/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</h3>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* MAIN CHART */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Revenue Over Time</h4>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#114B5F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#114B5F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#114B5F" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, fill: '#114B5F', stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ACTIVE INVENTORY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Active Inventory</h4>
            <button className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">View All</button>
          </div>
          
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {apps.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-700">
                  <Box className="h-6 w-6 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No applications found</h3>
                <p className="text-xs text-zinc-500 max-w-[250px] mb-6 leading-relaxed">Get started by creating your first app to begin tracking revenue and impressions.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  Create App
                </button>
              </div>
            ) : (
              apps.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl mr-4 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                      <Smartphone className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{app.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-zinc-500">{app.platform}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <span className="text-[11px] text-zinc-500">{app.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-200/50 dark:border-emerald-500/20">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDEBAR (ACTIVITY & INSIGHTS) */}
      {showActivity && (
        <ActivityTimeline apps={apps} onClose={() => setShowActivity(false)} />
      )}
    </div>
  );
}
