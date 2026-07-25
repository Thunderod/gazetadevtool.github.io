import { useState, useEffect } from 'react';
import { Smartphone, Activity, Loader2, Plus, CheckCircle2, Zap, BookOpen, LayoutTemplate } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const { data: appsData } = await supabase.from('apps').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (appsData) setApps(appsData);
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

        {/* ONBOARDING & QUICK ACTIONS */}
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
            <a href="/apps" className="group flex-1 bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 text-white shadow-lg shadow-brand-900/20 relative overflow-hidden transition-all hover:scale-[1.02]">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-1 mt-auto">New App</h4>
                <p className="text-sm text-white/80 font-medium">Register application</p>
              </div>
            </a>
            <a href="/docs" className="group flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all hover:scale-[1.02]">
              <div className="absolute right-0 top-0 w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 text-zinc-600 dark:text-zinc-400 group-hover:text-brand-500 transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1 mt-auto">Read Docs</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Integration guides</p>
              </div>
            </a>
          </motion.div>
        </div>

        {/* Your Apps Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm mt-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-zinc-400" />
              Your Applications
            </h3>
            <a href="/apps" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">View all</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.slice(0, 3).map(app => (
              <div key={app.id} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                    <Smartphone className="h-5 w-5 text-zinc-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{app.name}</h4>
                    <p className="text-xs font-mono text-zinc-500 truncate max-w-[120px]">{app.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 capitalize">
                    {app.platform}
                  </span>
                </div>
              </div>
            ))}
            {apps.length === 0 && (
              <div className="col-span-full py-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-zinc-400" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">No apps yet</h4>
                <p className="text-sm text-zinc-500">Register your first app to get started</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDEBAR (Insights / Activity) */}
      {showActivity && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:w-96 flex-shrink-0"
        >
          <div className="sticky top-24 space-y-6">
            {/* Quick Stats - Replaced revenue with basic counts */}
            <div className="bg-zinc-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-zinc-900/20">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Zap className="h-5 w-5 text-brand-400" />
                </div>
                <h3 className="font-bold">System Status</h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Active Apps</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{apps.filter(a => a.status === 'active').length}</span>
                    <span className="text-white/60 text-sm font-medium">/ {apps.length}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Ad Network</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-400">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <ActivityTimeline apps={apps} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
