import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Smartphone, BarChart3, Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      
      <Command 
        className="relative w-full max-w-[640px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4"
        loop
      >
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <Command.Input 
            autoFocus 
            placeholder="Type a command or search..." 
            className="flex-1 h-14 bg-transparent outline-none px-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
          <div className="flex items-center gap-1">
            <kbd className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 font-sans">ESC</kbd>
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          <Command.Empty className="py-6 text-center text-sm text-zinc-500">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <LayoutDashboard className="w-4 h-4 opacity-70" />
              Go to Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/apps'))}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <Smartphone className="w-4 h-4 opacity-70" />
              Manage Apps
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/analytics'))}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <BarChart3 className="w-4 h-4 opacity-70" />
              View Analytics
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/settings'))}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <Settings className="w-4 h-4 opacity-70" />
              Developer Settings
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Appearance" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-2 border-t border-zinc-100 dark:border-zinc-800/50 mt-1">
            <Command.Item 
              onSelect={() => runCommand(() => setTheme('light'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <Sun className="w-4 h-4 opacity-70" />
              Light Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => setTheme('dark'))}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <Moon className="w-4 h-4 opacity-70" />
              Dark Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => setTheme('system'))}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl cursor-pointer aria-selected:bg-brand-50 dark:aria-selected:bg-brand-900/30 aria-selected:text-brand-700 dark:aria-selected:text-brand-300"
            >
              <Monitor className="w-4 h-4 opacity-70" />
              System Theme
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
