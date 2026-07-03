import { Bell, Search, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Console Overview</h1>
      </div>
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm leading-6 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Search apps, ad units..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cloudflare R2 Sync: Active</span>
        </div>
        <button className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New App
        </button>
        <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors relative ml-2">
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
