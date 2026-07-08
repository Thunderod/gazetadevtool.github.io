import { Terminal, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function IntegrationDocs() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const scriptSnippet = `<script src="${window.location.origin}${import.meta.env.BASE_URL}gazeta-sdk.js"></script>`;
  const htmlSnippet = `<gazeta-ad app-id="YOUR_APP_ID"></gazeta-ad>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Integration is a Breeze</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
          No complicated setups. Just copy, paste, and get paid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-bold border border-brand-200/50 dark:border-brand-800/50">1</span>
            Load the SDK
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm font-medium">
            Drop this script into the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">&lt;head&gt;</code> of your website.
          </p>
          
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl p-4 flex items-center justify-between mt-auto border border-zinc-800">
            <code className="text-xs font-mono text-emerald-400 break-all">
              {scriptSnippet}
            </code>
            <button 
              onClick={() => handleCopy(scriptSnippet, 'script')}
              className="text-zinc-400 hover:text-white transition-colors ml-4 shrink-0 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl"
            >
              {copiedSnippet === 'script' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-200/50 dark:border-emerald-800/50">2</span>
            Place the Ad
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm font-medium">
            Put this tag exactly where you want the ad to show up. Swap out <code className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">YOUR_APP_ID</code>.
          </p>
          
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl p-4 flex items-center justify-between mt-auto border border-zinc-800">
            <code className="text-xs font-mono text-amber-300 break-all">
              {htmlSnippet}
            </code>
            <button 
              onClick={() => handleCopy(htmlSnippet, 'html')}
              className="text-zinc-400 hover:text-white transition-colors ml-4 shrink-0 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl"
            >
              {copiedSnippet === 'html' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800"
      >
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-brand-500" />
          Pro Tips (Optional Attributes)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <code className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1 block">target-age="18-24"</code>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Filter ads to match your audience.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <code className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1 block">app-category="game"</code>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Get better converting ads for your niche.</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
