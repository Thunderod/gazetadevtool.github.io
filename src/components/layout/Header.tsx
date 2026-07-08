import { Bell, Search, Plus, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerCmdK = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-4 md:px-8 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm' 
        : 'bg-zinc-50 dark:bg-zinc-950 border-b border-transparent'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 hidden sm:block tracking-tight">Console Overview</h1>
      </div>
      
      <div className="flex flex-1 items-center justify-center px-4 md:px-8 max-w-2xl mx-auto">
        <button 
          onClick={triggerCmdK}
          className="group relative flex w-full items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <Search className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="hidden lg:flex items-center space-x-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 px-2.5 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Edge Network</span>
        </div>
        
        <button className="hidden sm:flex px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white rounded-lg text-[13px] font-medium shadow-sm transition-colors items-center gap-1.5">
          <Plus className="h-4 w-4" />
          New App
        </button>
        <button className="sm:hidden flex items-center justify-center h-8 w-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-sm">
          <Plus className="h-4 w-4" />
        </button>

        <button type="button" className="group relative p-2 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-zinc-50 dark:ring-zinc-950 group-hover:ring-zinc-100 dark:group-hover:ring-zinc-800 transition-all"></span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
