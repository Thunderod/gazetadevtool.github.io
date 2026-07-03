import { Plus, Smartphone, MoreVertical, Globe, X, AlertCircle, Loader2, CheckCircle, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AppProperty, AppPlatform, AppCategory } from '../types';

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'android': return <Smartphone className="h-5 w-5 text-slate-500" />;
    case 'web': return <Globe className="h-5 w-5 text-slate-500" />;
    default: return <Smartphone className="h-5 w-5 text-slate-500" />;
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
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', appToDelete.id);
        
      if (error) throw error;
      
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
          <h1 className="text-lg font-semibold text-slate-900">Apps & Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your monetized applications and websites.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add App
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start text-left">
          <AlertCircle className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-400 border-b border-slate-200 font-bold">
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
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  <div className="flex justify-center mb-2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                  Loading properties...
                </td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No applications found. Add your first app to get started.
                </td>
              </tr>
            ) : apps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <PlatformIcon platform={app.platform} />
                    </div>
                    <span className="font-semibold text-slate-900">{app.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 group">
                    <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded truncate max-w-[100px]" title={app.id}>{app.id}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(app.id)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy App ID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">{app.platform}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{app.bundle_id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ${
                    app.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                    app.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {app.status === 'active' ? 'LIVE' : app.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-900 font-semibold">$0.00</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => confirmDelete(app)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                    title="Delete App"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-slate-900">
                {createdAppId ? 'App Created' : 'Add New App'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {createdAppId ? (
              <div className="p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Success!</h3>
                <p className="text-sm text-slate-500 mb-8">
                  Your app has been successfully registered. You will need your App ID to initialize the SDK.
                </p>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-left">App ID</p>
                  <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl">
                    <code className="text-sm font-mono text-indigo-600 truncate">{createdAppId}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(createdAppId)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={closeModal}
                  className="w-full py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateApp} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">App Name</label>
                  <input 
                    type="text" 
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="e.g. Skyward RPG"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['android', 'web'] as AppPlatform[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewAppPlatform(p)}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl border ${
                          newAppPlatform === p 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        } transition-colors`}
                      >
                        <PlatformIcon platform={p} />
                        <span className="text-xs font-medium mt-1 capitalize">{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {newAppPlatform === 'android' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['game', 'app'] as AppCategory[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewAppCategory(c)}
                          className={`py-2 rounded-xl border text-sm font-medium capitalize ${
                            newAppCategory === c 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          } transition-colors`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Genre / Topic</label>
                  <select
                    value={newAppGenre}
                    onChange={(e) => setNewAppGenre(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all capitalize"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supported Ad Formats</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['banner', 'interstitial', 'rewarded', 'native']).map((f) => (
                      <label
                        key={f}
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                          newAppFormats.includes(f) 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={newAppFormats.includes(f)}
                          onChange={() => toggleFormat(f)}
                        />
                        <span className="text-sm font-medium capitalize select-none">{f}</span>
                        {newAppFormats.includes(f) && (
                           <CheckCircle className="h-4 w-4 ml-auto text-indigo-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={newAppAudience}
                    onChange={(e) => setNewAppAudience(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="everyone">Everyone</option>
                    <option value="teen">Teen (13+)</option>
                    <option value="mature">Mature (17+)</option>
                    <option value="adult">Adult Only (18+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {newAppPlatform === 'web' ? 'Domain URL' : 'Bundle ID / Package Name'}
                  </label>
                  <input 
                    type="text" 
                    value={newAppBundle}
                    onChange={(e) => setNewAppBundle(e.target.value)}
                    placeholder={newAppPlatform === 'web' ? 'e.g. example.com' : 'e.g. com.studio.game'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Adding...' : 'Add App'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {isDeleteModalOpen && appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8">
            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete App?</h3>
            <p className="text-sm text-slate-500 mb-8">
              Are you sure you want to delete <span className="font-semibold text-slate-700">"{appToDelete.name}"</span>? This action cannot be undone and will permanently remove all associated analytics.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteApp}
                disabled={isDeleting}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition-colors disabled:opacity-70"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
