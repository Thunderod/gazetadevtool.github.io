import { useState } from 'react';
import { User, CreditCard, Key, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'api'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Developer Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account, billing, and API preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className={`mr-3 h-5 w-5 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`} />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className={`mr-3 h-5 w-5 ${activeTab === 'billing' ? 'text-indigo-600' : 'text-slate-400'}`} />
              Billing & Payouts
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'api' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Key className={`mr-3 h-5 w-5 ${activeTab === 'api' ? 'text-indigo-600' : 'text-slate-400'}`} />
              Account & API
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSave} className="p-8">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Details</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-400">
                          {user?.email?.substring(0,2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      Change Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.user_metadata?.full_name || ''}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 text-slate-500 px-4 py-2 text-sm outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email is managed by your authentication provider.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Payout Methods</h2>
                  <p className="text-sm text-slate-500 mb-6">Configure how you receive your ad revenue. Payments are processed on a net-30 schedule.</p>
                  
                  <div className="space-y-6">
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">CH</div>
                        <h3 className="font-semibold text-slate-900">Chapa Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Account Name</label>
                          <input type="text" placeholder="e.g. Abebe Kebede" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Bank Account / Phone</label>
                          <input type="text" placeholder="Account Number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">TB</div>
                        <h3 className="font-semibold text-slate-900">Telebirr Configuration</h3>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Telebirr Mobile Number</label>
                        <input type="text" placeholder="+251 911 234 567" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API TAB */}
              {activeTab === 'api' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Account & API Status</h2>
                  
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                    <h3 className="font-semibold text-indigo-900 mb-1">Publisher Account ID</h3>
                    <div className="flex items-center justify-between gap-4">
                      <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-indigo-200 text-sm text-indigo-700 font-mono break-all">
                        {user?.id}
                      </code>
                    </div>
                    <p className="text-xs text-indigo-600 mt-2">This is your master publisher ID. Keep it secret.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">Active</span>
                      <span className="text-xs text-slate-500">API Status</span>
                    </div>
                    
                    <div className="p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-slate-600">--</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">Unlimited</span>
                      <span className="text-xs text-slate-500">App Quota</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                {saveStatus === 'success' && (
                  <span className="flex items-center text-sm font-medium text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center text-sm font-medium text-rose-600 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Failed to save
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
