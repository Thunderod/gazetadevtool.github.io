import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase handles the URL hash/query params automatically when the client initializes.
      // We just need to check if a session was created or if an error occurred.
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        return;
      }

      if (session) {
        navigate('/', { replace: true });
      } else {
        // Sometimes it takes a moment to process the hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            navigate('/', { replace: true });
          }
        });
        
        return () => subscription.unsubscribe();
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-rose-200 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
}
