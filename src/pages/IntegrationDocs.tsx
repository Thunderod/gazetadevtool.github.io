import { Terminal, Copy, CheckCircle, Code, Settings2, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
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
  const htmlSnippet = `<!-- The ad naturally fills its parent container. -->
<!-- For a full-screen immersive experience, wrap it like this: -->
<div style="width: 100vw; height: 100vh; position: fixed; inset: 0;">
  <gazeta-ad app-id="YOUR_APP_ID"></gazeta-ad>
</div>`;
  
  const advancedSnippet = `<!-- Advanced Rewarded Ad Example -->
<gazeta-ad 
  app-id="YOUR_APP_ID"
  target-age="18-35" 
  app-category="finance"
  format="rewarded"
>
  <button slot="close-button" onclick="grantReward()">
    Claim Reward
  </button>
</gazeta-ad>`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl pb-10">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Developer Documentation</h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2 font-medium max-w-2xl">
          Integrate the Gazeta Ad Network into your application in minutes. No complex SDK initialization or bloated dependencies—just pure web components.
        </p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        
        {/* Prerequisite Section */}
        <motion.div variants={itemVariants} className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-3xl border border-brand-100 dark:border-brand-800/50">
          <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Prerequisites: Get Your App ID
          </h3>
          <p className="text-brand-700 dark:text-brand-300 text-sm font-medium leading-relaxed">
            Before embedding any ads, you must register your application in the <strong className="text-brand-900 dark:text-brand-100">Apps & Properties</strong> tab. 
            Once registered, you will be given a unique <code className="bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded text-brand-700 dark:text-brand-400 shadow-sm border border-brand-200 dark:border-brand-700/50">App ID</code>. You will need to replace <code className="text-emerald-600 dark:text-emerald-400 font-bold">YOUR_APP_ID</code> in the snippets below with your actual ID.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-bold border border-brand-200/50 dark:border-brand-800/50 shadow-sm">1</span>
              Load the Core SDK
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-[15px] leading-relaxed">
              Drop this script tag into the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm text-zinc-700 dark:text-zinc-300">&lt;head&gt;</code> of your website. This is a lightweight asynchronous script that registers the <code className="font-mono text-sm">&lt;gazeta-ad&gt;</code> web component.
            </p>
            
            <div className="bg-zinc-950 rounded-2xl p-4 flex items-center justify-between mt-auto border border-zinc-800 shadow-inner">
              <code className="text-[13px] font-mono text-emerald-400 break-all leading-tight">
                {scriptSnippet}
              </code>
              <button 
                onClick={() => handleCopy(scriptSnippet, 'script')}
                className="text-zinc-400 hover:text-white transition-colors ml-4 shrink-0 bg-zinc-800/50 hover:bg-zinc-700 p-2.5 rounded-xl border border-zinc-700"
                title="Copy to clipboard"
              >
                {copiedSnippet === 'script' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">2</span>
              Mount the Ad Unit
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-[15px] leading-relaxed">
              Place this custom HTML tag exactly where you want the ad to render. The <code className="font-mono text-sm">&lt;gazeta-ad&gt;</code> is a completely fluid, Edge-to-Edge component. It will automatically consume 100% of the width and height of its parent container. For a full-screen immersive experience, drop it into a full-screen wrapper.
            </p>
            
            <div className="bg-zinc-950 rounded-2xl p-4 flex items-center justify-between mt-auto border border-zinc-800 shadow-inner">
              <code className="text-[13px] font-mono text-amber-300 break-all leading-tight">
                {htmlSnippet}
              </code>
              <button 
                onClick={() => handleCopy(htmlSnippet, 'html')}
                className="text-zinc-400 hover:text-white transition-colors ml-4 shrink-0 bg-zinc-800/50 hover:bg-zinc-700 p-2.5 rounded-xl border border-zinc-700"
                title="Copy to clipboard"
              >
                {copiedSnippet === 'html' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Customization Section */}
        <motion.div variants={itemVariants} className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
              <Settings2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Advanced Configuration</h3>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl leading-relaxed">
            The <code className="font-mono text-sm bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200">&lt;gazeta-ad&gt;</code> element supports several HTML attributes that allow you to control targeting and ad formats. Because it is an edge-to-edge component, you don't need to pass width or height properties—the UI floats securely over the background media and dynamically adapts to the container's safe-areas.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800/50">target-age</code>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">Targeting</span>
                </div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Filters ad inventory to match your specific user demographic. Passing accurate ranges (e.g., <code className="text-zinc-700 dark:text-zinc-300 font-mono">18-24</code>, <code className="text-zinc-700 dark:text-zinc-300 font-mono">25-34</code>) drastically improves Click-Through Rates (CTR).
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800/50">app-category</code>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">Targeting</span>
                </div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Allows you to restrict the types of ads shown on your site. For example, pass <code className="text-zinc-700 dark:text-zinc-300 font-mono">game</code> if your site is a gaming portal to receive gaming-related ads, which generally convert better.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <code className="text-[13px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded border border-violet-100 dark:border-violet-800/50 w-fit">format="rewarded"</code>
                    <code className="text-[13px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded border border-violet-100 dark:border-violet-800/50 w-fit">skip-after="10"</code>
                  </div>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-800/50">Format & Timing</span>
                </div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Pass <code className="text-zinc-700 dark:text-zinc-300 font-mono">format="rewarded"</code> to fetch unskippable 30s ads (perfect for unlocking in-app currency). Or pass <code className="text-zinc-700 dark:text-zinc-300 font-mono">format="normal"</code> with <code className="text-zinc-700 dark:text-zinc-300 font-mono">skip-after="5"</code> to enforce a strict countdown before the user's custom close button is revealed.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-[13px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded border border-brand-100 dark:border-brand-800/50">slot="close-button"</code>
                  <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800/50">Customization</span>
                </div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  The SDK leaves a dedicated space for you to inject your own custom close button. Just nest any HTML element with <code className="text-zinc-700 dark:text-zinc-300 font-mono">slot="close-button"</code> inside the tag, and it will be perfectly positioned at the top right.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 shadow-inner flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">Example Implementation</span>
              </div>
              <pre className="text-[13px] font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap flex-1 leading-relaxed">
                <span className="text-brand-400">&lt;gazeta-ad</span>{'\n'}
                <span className="text-emerald-300">  app-id=</span><span className="text-amber-300">"YOUR_APP_ID"</span>{'\n'}
                <span className="text-emerald-300">  target-age=</span><span className="text-amber-300">"18-35"</span>{'\n'}
                <span className="text-emerald-300">  app-category=</span><span className="text-amber-300">"finance"</span>{'\n'}
                <span className="text-emerald-300">  format=</span><span className="text-amber-300">"rewarded"</span>{'\n'}
                <span className="text-brand-400">&gt;</span>{'\n'}
                <span className="text-zinc-300">  </span><span className="text-brand-400">&lt;button</span><span className="text-emerald-300"> slot=</span><span className="text-amber-300">"close-button"</span><span className="text-emerald-300"> onclick=</span><span className="text-amber-300">"grantReward()"</span><span className="text-brand-400">&gt;</span>{'\n'}
                <span className="text-zinc-300">    Claim Reward</span>{'\n'}
                <span className="text-zinc-300">  </span><span className="text-brand-400">&lt;/button&gt;</span>{'\n'}
                <span className="text-brand-400">&lt;/gazeta-ad&gt;</span>
              </pre>
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <button 
                  onClick={() => handleCopy(advancedSnippet, 'advanced')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors border border-zinc-700"
                >
                  {copiedSnippet === 'advanced' ? (
                    <><CheckCircle className="h-4 w-4 text-emerald-400" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copy Advanced Snippet</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pre-fetching Section */}
        <motion.div variants={itemVariants} className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-200 dark:border-indigo-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Zero-Latency Pre-fetching (New)</h3>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-3xl leading-relaxed">
            For the best possible user experience, you can initialize the SDK early (e.g., on your splash screen or loading state). This will silently pre-fetch a pool of ads and cache their heavy video/image assets in the background. When the <code className="font-mono text-sm">gazeta-ad</code> element is finally rendered, it will appear instantly with <strong>0ms network latency</strong>.
          </p>

          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 shadow-inner flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-mono text-zinc-400">Initialize Early (Optional but Recommended)</span>
            </div>
            <pre className="text-[13px] font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
<span className="text-brand-400">&lt;script&gt;</span>{'\n'}
<span className="text-zinc-300">  </span><span className="text-emerald-300">window.Gazeta.init</span><span className="text-zinc-300">(</span><span className="text-amber-300">'YOUR_APP_ID'</span><span className="text-zinc-300">, </span><span className="text-amber-300">'18-35'</span><span className="text-zinc-300">, </span><span className="text-amber-300">'finance'</span><span className="text-zinc-300">);</span>{'\n'}
<span className="text-brand-400">&lt;/script&gt;</span>
            </pre>
          </div>
        </motion.div>

        {/* Immersive Architecture Section */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
              <Settings2 className="h-5 w-5 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Under the Hood: Immersive Architecture</h3>
          </div>
          
          <p className="text-zinc-400 mb-8 max-w-3xl leading-relaxed">
            Gazeta is engineered to provide a premium, modern ad experience. We completely stripped away legacy pixel sizes and Javascript aspect-ratio calculators in favor of a modern CSS architecture built for immersive, edge-to-edge media.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                100% Parent Adoption
              </h4>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                The ad behaves like water. It forces no max-width or aspect-ratio. It perfectly fills 100% of the HTML container you place it inside. If you put it in a fullscreen div, it becomes a fullscreen ad.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Blurred Background Trick
              </h4>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                To prevent ugly black bars or aggressive cropping on mismatched videos, we use a dual-layer media system. A heavily blurred, zoomed-in background layer dynamically color-matches the empty space, while the crisp video plays uncropped in the foreground.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Absolute Floating UI
              </h4>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                The UI is completely detached from the media using absolute positioning. It is permanently pinned to the edges, utilizing <code className="text-brand-300 bg-brand-500/10 px-1 rounded">env(safe-area-inset)</code> to ensure notches never cover the buttons, keeping the center completely unobstructed.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Fluid Typography (cqw)
              </h4>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Instead of fixed breakpoints, the SDK uses CSS Container Queries. All fonts, paddings, and buttons use mathematical <code className="text-brand-300 bg-brand-500/10 px-1 rounded">clamp()</code> functions tied to the container width, ensuring it scales flawlessly on everything from a tiny iPhone SE to a massive tablet in 0 milliseconds without layout jitter.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error Handling & Testing Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Error Handling & Analytics</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
              The SDK is designed to be completely failure-resistant. If an ad fails to load due to network issues, or if there is no available ad inventory matching your targeting criteria, the SDK will gracefully fail by either collapsing or displaying a transparent 1px container so that your website's layout is never broken.
            </p>
            
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 p-5 rounded-2xl flex items-start gap-4">
              <div className="mt-0.5"><AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" /></div>
              <div>
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200 mb-1">Testing Your Integration</h4>
                <p className="text-[13px] text-rose-700 dark:text-rose-300 leading-relaxed">
                  If you forget to replace <code className="font-mono bg-rose-100 dark:bg-rose-900/50 px-1 rounded">YOUR_APP_ID</code>, the ad unit will explicitly display a large red error box on your screen. This error box <strong className="font-bold">only</strong> appears for missing or invalid App IDs to help you during development. It will never be shown to your actual end-users if an ad simply fails to serve.
                </p>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px] pt-2">
              <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Analytics Tracking:</strong> Once the ad renders, the SDK automatically registers an <code>Impression</code> via an IntersectionObserver when at least 30% of the ad enters the viewport. Clicks are tracked immediately upon user interaction. You can view all metrics in real-time on your Analytics dashboard.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
