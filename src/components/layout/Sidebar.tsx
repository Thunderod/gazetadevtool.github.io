import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, BarChart3, Settings, LogOut, Wallet, BookOpen, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Apps', href: '/apps', icon: Smartphone },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Payouts', href: '/payouts', icon: Wallet },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'GD';
  const userDisplay = user?.email?.split('@')[0] || 'Developer';

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-[70] flex h-full w-[280px] flex-col border-r border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-transparent">
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-[10px] bg-brand-600 flex items-center justify-center shadow-inner shadow-white/20">
              <div className="w-3.5 h-3.5 border-[2.5px] border-white rounded-sm"></div>
            </div>
            Gazeta.
          </span>
          <button onClick={onClose} className="md:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-zinc-200/50 dark:bg-zinc-800/50 p-1.5 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto pt-8 px-4 scrollbar-hide">
          <nav className="flex-1 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={cn(
                    "group relative flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                    isActive
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className="relative flex items-center">
                    <item.icon
                      className={cn(
                        "mr-3 h-4 w-4 flex-shrink-0 transition-colors",
                        isActive ? "text-brand-600 dark:text-brand-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6 pb-6 space-y-2">
            <div className="px-3">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>
            </div>
            <Link
              to="/settings"
              onClick={() => window.innerWidth < 768 && onClose()}
              className={cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                location.pathname === '/settings'
                  ? "text-brand-700 dark:text-brand-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {location.pathname === '/settings' && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex items-center">
                <Settings className={cn(
                  "mr-3 h-4 w-4 transition-colors",
                  location.pathname === '/settings' ? "text-brand-600 dark:text-brand-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400"
                )} />
                Settings
              </div>
            </Link>

            <div className="mt-4 mx-1 flex items-center p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors group cursor-pointer border border-transparent dark:hover:border-zinc-800/50">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full mr-3 border border-zinc-200 dark:border-zinc-700 object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 mr-3 border border-brand-200/50 dark:border-brand-700/50 flex items-center justify-center font-bold text-[11px] tracking-widest">
                  {userInitials}
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{user?.user_metadata?.full_name || userDisplay}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">Supabase Session</p>
              </div>
              <button onClick={signOut} className="text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all" title="Sign Out">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
