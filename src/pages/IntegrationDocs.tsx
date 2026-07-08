import { Terminal, Copy, CheckCircle, Code } from 'lucide-react';
import { useState } from 'react';

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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integration is a Breeze</h1>
        <p className="text-base text-slate-500 mt-2 font-medium">
          No complicated setups. Just copy, paste, and get paid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-black">1</span>
            Load the SDK
          </h2>
          <p className="text-slate-500 mb-6 text-sm font-medium">
            Drop this script into the <code>&lt;head&gt;</code> of your website.
          </p>
          
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between mt-auto">
            <code className="text-xs font-mono text-emerald-400 break-all">
              {scriptSnippet}
            </code>
            <button 
              onClick={() => handleCopy(scriptSnippet, 'script')}
              className="text-slate-400 hover:text-white transition-colors ml-4 shrink-0 bg-white dark:bg-zinc-900/10 p-2 rounded-xl"
            >
              {copiedSnippet === 'script' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">2</span>
            Place the Ad
          </h2>
          <p className="text-slate-500 mb-6 text-sm font-medium">
            Put this tag exactly where you want the ad to show up. Swap out <code className="text-emerald-600 bg-emerald-50 px-1 rounded">YOUR_APP_ID</code>.
          </p>
          
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between mt-auto">
            <code className="text-xs font-mono text-amber-300 break-all">
              {htmlSnippet}
            </code>
            <button 
              onClick={() => handleCopy(htmlSnippet, 'html')}
              className="text-slate-400 hover:text-white transition-colors ml-4 shrink-0 bg-white dark:bg-zinc-900/10 p-2 rounded-xl"
            >
              {copiedSnippet === 'html' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-500" />
          Pro Tips (Optional Attributes)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200">
            <code className="text-sm font-bold text-indigo-600 mb-1 block">target-age="18-24"</code>
            <p className="text-xs text-slate-500">Filter ads to match your audience.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200">
            <code className="text-sm font-bold text-indigo-600 mb-1 block">app-category="game"</code>
            <p className="text-xs text-slate-500">Get better converting ads for your niche.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
