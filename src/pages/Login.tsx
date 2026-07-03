import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Github, AlertCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(provider);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || `An error occurred during ${provider} login`);
      setIsLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('email');
    setError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <div className="w-6 h-6 border-[3px] border-white rounded-md"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Welcome to Gazeta</h1>
        <p className="text-sm text-slate-500 mb-8">
          {isSignUp ? 'Create an account to manage your applications.' : 'Sign in to manage your monetized applications and ad inventory.'}
        </p>
        
        {error && (
          <div className={`mb-6 p-4 rounded-xl ${error.includes('Check your email') ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} flex items-start text-left`}>
            {error.includes('Check your email') ? (
               <Mail className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
            ) : (
               <AlertCircle className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${error.includes('Check your email') ? 'text-emerald-700' : 'text-rose-700'}`}>{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading === 'email' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-300 border-t-white"></div>
            ) : (
              <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading === 'github' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-white"></div>
            ) : (
              <Github className="h-5 w-5" />
            )}
            <span>GitHub</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading === 'google' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>Google</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-2">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
          <p className="text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
