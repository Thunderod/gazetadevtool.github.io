import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, BarChart3, Settings, LogOut, Wallet, BookOpen, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

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
          "fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-transparent">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            Gazeta.
          </span>
          <button onClick={onClose} className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={cn(
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                    'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-brand-700 dark:text-brand-300 opacity-70' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400 opacity-70',
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6 pb-6 space-y-1 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/settings"
              onClick={() => window.innerWidth < 768 && onClose()}
              className={cn(
                location.pathname === '/settings' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors'
              )}
            >
              <Settings className={cn(location.pathname === '/settings' ? 'text-brand-700 dark:text-brand-300 opacity-70' : 'text-slate-400 dark:text-slate-500 opacity-70', 'mr-3 h-5 w-5')} />
              Settings
            </Link>
            <div className="mt-4 flex items-center p-3 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl border border-transparent dark:border-slate-800">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full mr-3 border border-slate-600" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 mr-3 border border-slate-600 flex items-center justify-center font-bold text-sm">
                  {userInitials}
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold truncate">{user?.user_metadata?.full_name || userDisplay}</p>
                <p className="text-[10px] opacity-60 truncate">Connected to Supabase</p>
              </div>
              <button onClick={signOut} className="text-slate-400 hover:text-white p-1" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
