import { ArrowUpRight, ArrowDownRight, DollarSign, Eye, Smartphone, MousePointerClick } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', revenue: 124 },
  { name: 'Tue', revenue: 145 },
  { name: 'Wed', revenue: 110 },
  { name: 'Thu', revenue: 180 },
  { name: 'Fri', revenue: 230 },
  { name: 'Sat', revenue: 210 },
  { name: 'Sun', revenue: 290 },
];

const stats = [
  { name: 'Daily Revenue', value: '$1,248.50', change: '+12.4%', changeType: 'positive', icon: DollarSign },
  { name: 'Impressions', value: '842.1k', change: '+5.2%', changeType: 'positive', icon: Eye },
  { name: 'eCPM Average', value: '$1.47', change: '—', changeType: 'neutral', icon: MousePointerClick },
  { name: 'Fill Rate', value: '99.4%', change: '-0.3%', changeType: 'negative', icon: Smartphone },
];

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.name}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-light text-slate-900">{stat.value}</h3>
              {stat.changeType !== 'neutral' ? (
                <span className={`text-xs font-bold ${stat.changeType === 'positive' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-semibold text-slate-900">Revenue Flow (7 Days)</h4>
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="w-3 h-3 rounded-full bg-slate-200"></span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h4 className="font-semibold mb-6 text-slate-900">Active Inventory</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-100 rounded-lg mr-3 flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Skyward RPG</p>
                  <p className="text-[10px] text-slate-500">Unity Mobile</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">LIVE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg mr-3 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">TaskFlow Web</p>
                  <p className="text-[10px] text-slate-500">React Plugin</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">LIVE</span>
            </div>
            <div className="flex items-center justify-between p-3 opacity-60 border border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-100 rounded-lg mr-3 flex items-center justify-center text-slate-400">
                  +
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add SDK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between py-4 border-t border-slate-200 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
        <div className="flex space-x-6 flex-wrap gap-y-2">
          <span>SDK Version 4.2.1-stable</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>Supabase Auth: Encrypted</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>Creative CDN: Edge Optimized</span>
        </div>
        <div className="flex items-center text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
          System Operational
        </div>
      </footer>
    </div>
  );
}
