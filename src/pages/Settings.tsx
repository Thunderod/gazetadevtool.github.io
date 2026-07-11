import { useState } from 'react';
import { User, CreditCard, Save, Loader2, AlertCircle, CheckCircle2, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Developer Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage your account, billing, and API preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('profile')}
              type="button"
              className={`w-full flex items-center px-4 py-3 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'profile' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <User className={`mr-3 h-4 w-4 ${activeTab === 'profile' ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
              Account Details
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              type="button"
              className={`w-full flex items-center px-4 py-3 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'billing' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <CreditCard className={`mr-3 h-4 w-4 ${activeTab === 'billing' ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
              Billing & Payouts
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              type="button"
              className={`w-full flex items-center px-4 py-3 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'notifications' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Bell className={`mr-3 h-4 w-4 ${activeTab === 'notifications' ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              type="button"
              className={`w-full flex items-center px-4 py-3 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'security' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Shield className={`mr-3 h-4 w-4 ${activeTab === 'security' ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
              Security
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSave} className="p-8">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">Profile Details</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">
                          {user?.email?.substring(0,2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button type="button" className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      Change Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.user_metadata?.full_name || ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500 px-4 py-2.5 text-sm outline-none cursor-not-allowed opacity-70"
                      />
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Email is managed by your authentication provider.</p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Appearance</h3>
                    <div className="flex flex-wrap gap-4">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                            theme === t 
                              ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/30 dark:border-brand-700/50 dark:text-brand-300' 
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Payout Methods</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Configure how you receive your ad revenue. Payments are processed on a net-30 schedule.</p>
                  
                  <div className="space-y-6">
                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-emerald-500/20">CH</div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Chapa Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">Account Name</label>
                          <input type="text" placeholder="e.g. Abebe Kebede" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">Bank Account / Phone</label>
                          <input type="text" placeholder="Account Number" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">TB</div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Telebirr Configuration</h3>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">Telebirr Mobile Number</label>
                        <input type="text" placeholder="+251 911 234 567" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Weekly Reports', desc: 'Receive a weekly summary of your app performance.' },
                      { title: 'Payout Alerts', desc: 'Get notified when a payout is processed or fails.' },
                      { title: 'System Updates', desc: 'News about Gazeta API and SDK changes.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30">
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{item.title}</h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">Security</h2>
                  
                  <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 mb-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-all" />
                      </div>
                      <button type="button" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors mt-2">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border border-rose-200 dark:border-rose-900/50 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10">
                    <h3 className="font-semibold text-rose-700 dark:text-rose-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-rose-600/80 dark:text-rose-400/80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button type="button" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-4">
                {saveStatus === 'success' && (
                  <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center text-sm font-medium text-rose-600 dark:text-rose-400 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Failed to save
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
