import { Plus, Smartphone, MoreVertical, Globe, X, AlertCircle, Loader2, CheckCircle, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AppProperty, AppPlatform, AppCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'android': return <Smartphone className="h-5 w-5" />;
    case 'web': return <Globe className="h-5 w-5" />;
    default: return <Smartphone className="h-5 w-5" />;
  }
}

export function AppsList() {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);
  
  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppProperty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state
  const [newAppName, setNewAppName] = useState('');
  const [newAppPlatform, setNewAppPlatform] = useState<AppPlatform>('android');
  const [newAppBundle, setNewAppBundle] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<AppCategory>('app');
  const [newAppGenre, setNewAppGenre] = useState('');
  const [newAppAudience, setNewAppAudience] = useState('everyone');
  const [newAppFormats, setNewAppFormats] = useState<string[]>(['banner']);

  const fetchApps = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (err: any) {
      console.error('Error fetching apps:', err);
      setError(err.message || 'Failed to load apps');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user]);

  // Reset category when platform changes
  useEffect(() => {
    if (newAppPlatform === 'web') {
      setNewAppCategory('website');
      setNewAppGenre('blog');
    } else {
      setNewAppCategory('app');
      setNewAppGenre('utility');
    }
  }, [newAppPlatform]);

  const toggleFormat = (format: string) => {
    setNewAppFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format) 
        : [...prev, format]
    );
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newAppName.trim() || !newAppBundle.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    if (newAppFormats.length === 0) {
      alert('Please select at least one ad format');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('apps')
        .insert([
          {
            user_id: user.id,
            name: newAppName.trim(),
            platform: newAppPlatform,
            bundle_id: newAppBundle.trim(),
            category: newAppCategory,
            genre: newAppGenre,
            target_audience: newAppAudience,
            status: 'active',
            ad_formats: newAppFormats
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setApps([data[0], ...apps]);
        setCreatedAppId(data[0].id);
      }
    } catch (err: any) {
      console.error('Error creating app:', err);
      alert(err.message || 'Failed to create app');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const confirmDelete = (app: AppProperty) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteApp = async () => {
    if (!appToDelete) return;
    
    try {
      setIsDeleting(true);
      const { data, error } = await supabase
        .from('apps')
        .delete()
        .eq('id', appToDelete.id)
        .select();
        
      if (error) throw error;
      if (!data || data.length === 0) {
          throw new Error('Failed to delete on the backend. You may not have permission.');
      }
      
      setApps(apps.filter(a => a.id !== appToDelete.id));
      setIsDeleteModalOpen(false);
      setAppToDelete(null);
    } catch (err: any) {
      console.error('Error deleting app:', err);
      alert(err.message || 'Failed to delete app');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreatedAppId(null);
    setNewAppName('');
    setNewAppPlatform('android');
    setNewAppBundle('');
    setNewAppCategory('app');
    setNewAppGenre('utility');
    setNewAppAudience('everyone');
    setNewAppFormats(['banner']);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Apps & Properties</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage your monetized applications and websites.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add App
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 flex items-start text-left">
          <AlertCircle className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm dark:shadow-zinc-950/50"
      >
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-bold">
            <tr>
              <th scope="col" className="px-6 py-4">App Name</th>
              <th scope="col" className="px-6 py-4">App ID (API Key)</th>
              <th scope="col" className="px-6 py-4">Platform</th>
              <th scope="col" className="px-6 py-4">Bundle ID / Domain</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Est. Revenue (7d)</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-center mb-2">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                  </div>
                  Loading properties...
                </td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No applications found. Add your first app to get started.
                </td>
              </tr>
            ) : apps.map((app) => (
              <tr key={app.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <PlatformIcon platform={app.platform} />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{app.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 group">
                    <code className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-md truncate max-w-[100px]" title={app.id}>{app.id}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(app.id)}
                      className="text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy App ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">{app.platform}</td>
                <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">{app.bundle_id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ${
                    app.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 
                    app.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' : 
                    'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                  }`}>
                    {app.status === 'active' ? 'LIVE' : app.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-semibold">$0.00</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => confirmDelete(app)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                    title="Delete App"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md z-10">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {createdAppId ? 'App Created' : 'Add New App'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {createdAppId ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Success!</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
                    Your app has been successfully registered. You will need your App ID to initialize the SDK.
                  </p>
                  
                  <div className="bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-8">
                    <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 text-left">App ID</p>
                    <div className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl shadow-sm">
                      <code className="text-sm font-mono text-brand-600 dark:text-brand-400 truncate font-semibold">{createdAppId}</code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(createdAppId)}
                        className="p-2 text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors shrink-0"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={closeModal}
                    className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateApp} className="p-6 space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">App Name</label>
                    <input 
                      type="text" 
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="e.g. Skyward RPG"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Platform</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['android', 'web'] as AppPlatform[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewAppPlatform(p)}
                          className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                            newAppPlatform === p 
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <span className={newAppPlatform === p ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400'}><PlatformIcon platform={p} /></span>
                          <span className="text-[13px] font-semibold mt-1.5 capitalize">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {newAppPlatform === 'android' && (
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Category</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['game', 'app'] as AppCategory[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setNewAppCategory(c)}
                            className={`py-2 rounded-xl border text-[13px] font-semibold capitalize transition-all ${
                              newAppCategory === c 
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Genre / Topic</label>
                    <select
                      value={newAppGenre}
                      onChange={(e) => setNewAppGenre(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all capitalize"
                      required
                    >
                      {newAppCategory === 'game' ? (
                        ['action', 'puzzle', 'rpg', 'strategy', 'casual', 'simulation', 'sports', 'other'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))
                      ) : newAppCategory === 'app' ? (
                        ['utility', 'productivity', 'entertainment', 'education', 'social', 'lifestyle', 'other'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))
                      ) : (
                        ['blog', 'e-commerce', 'tool', 'news', 'entertainment', 'portfolio', 'other'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Supported Ad Formats</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['banner', 'interstitial', 'rewarded', 'native']).map((f) => (
                        <label
                          key={f}
                          className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            newAppFormats.includes(f) 
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={newAppFormats.includes(f)}
                            onChange={() => toggleFormat(f)}
                          />
                          <span className="text-[13px] font-semibold capitalize select-none">{f}</span>
                          {newAppFormats.includes(f) && (
                             <CheckCircle className="h-4 w-4 ml-auto text-brand-600 dark:text-brand-400" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Target Audience</label>
                    <select
                      value={newAppAudience}
                      onChange={(e) => setNewAppAudience(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                      required
                    >
                      <option value="everyone">Everyone</option>
                      <option value="teen">Teen (13+)</option>
                      <option value="mature">Mature (17+)</option>
                      <option value="adult">Adult Only (18+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {newAppPlatform === 'web' ? 'Domain URL' : 'Bundle ID / Package Name'}
                    </label>
                    <input 
                      type="text" 
                      value={newAppBundle}
                      onChange={(e) => setNewAppBundle(e.target.value)}
                      placeholder={newAppPlatform === 'web' ? 'e.g. example.com' : 'e.g. com.studio.game'}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button 
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-md hover:bg-zinc-800 dark:hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Adding...' : 'Add App'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && appToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Delete App?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
                Are you sure you want to delete <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{appToDelete.name}"</span>? This action cannot be undone and will permanently remove all associated analytics.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-700"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteApp}
                  disabled={isDeleting}
                  className="flex-1 flex justify-center items-center gap-2 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-70 shadow-md"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
