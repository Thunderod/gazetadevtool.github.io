import { Bell, Search, Plus, Menu } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">Console Overview</h1>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 md:px-8">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-3 text-sm leading-6 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
            placeholder="Search apps..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cloudflare R2 Sync: Active</span>
        </div>
        <button className="px-3 md:px-5 py-2 bg-brand-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-brand-900/20 hover:bg-brand-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New App</span>
        </button>
        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative ml-1 md:ml-2 p-2">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
