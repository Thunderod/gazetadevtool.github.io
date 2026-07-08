import { useState } from 'react';
import { Smartphone, Zap, CheckSquare, X, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityTimelineProps {
  apps: any[];
  onClose: () => void;
}

export function ActivityTimeline({ apps, onClose }: ActivityTimelineProps) {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const events = [
    {
      id: 1,
      type: 'success',
      icon: Smartphone,
      title: 'New App Created',
      desc: `"${apps[0]?.name || 'App'}" has been successfully registered.`,
      time: 'Just now',
      details: 'App ID has been generated and API keys are ready for integration. Waiting for first SDK initialization ping.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 2,
      type: 'system',
      icon: Zap,
      title: 'System: Edge Optimized',
      desc: 'Creative CDN cache purged and optimized.',
      time: '45m ago',
      details: 'Global edge cache hit ratio is currently at 99.8%. Average latency dropped by 12ms across Europe and US East regions.',
      color: 'text-brand-500',
      bg: 'bg-brand-500/10 border-brand-500/20'
    }
  ];

  return (
    <div className="w-full lg:w-[360px] shrink-0 space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm dark:shadow-xl dark:shadow-zinc-950/50 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand-500" />
          Activity & Insights
        </h3>
        
        <div className="relative pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-8">
          {events.map((event) => (
            <div key={event.id} className="relative group">
              <div className={`absolute -left-[33px] top-0.5 flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white dark:border-zinc-900 ${event.bg} ${event.color} z-10 transition-transform group-hover:scale-110`}>
                <event.icon className="h-3.5 w-3.5" />
              </div>
              <div 
                className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">{event.title}</h4>
                  {expandedEvent === event.id ? <ChevronUp className="h-3.5 w-3.5 text-zinc-400" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{event.desc}</p>
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-3 block">{event.time}</span>
                
                <AnimatePresence>
                  {expandedEvent === event.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {event.details}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm dark:shadow-xl dark:shadow-zinc-950/50"
      >
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-sm tracking-tight">Integration Tasks</h3>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 rounded-md border border-brand-500 bg-brand-500 text-white mt-0.5 shadow-sm shadow-brand-500/20">
              <CheckSquare className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 line-through opacity-50">Integrate SDK version 4.2.1</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 group-hover:border-brand-400 mt-0.5 transition-colors"></div>
            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Configure Supabase Auth webhooks</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 group-hover:border-brand-400 mt-0.5 transition-colors"></div>
            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Review GDPR compliance settings</p>
            </div>
          </label>
        </div>
      </motion.div>
    </div>
  );
}
