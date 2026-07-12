import { Copy, CheckCircle, Info, ChevronRight, Hash, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function SyntaxHighlighter({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        let content = line;
        // Escape HTML
        content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Comments
        content = content.replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-zinc-500 italic">$1</span>');
        
        // Attributes (app-id="...")
        content = content.replace(/([a-zA-Z-]+)=(&quot;.*?&quot;|&#39;.*?&#39;|".*?")/g, '<span class="text-emerald-400">$1</span>=<span class="text-amber-300">$2</span>');
        
        // Tags
        content = content.replace(/(&lt;\/?[a-zA-Z-]+)/g, '<span class="text-violet-400">$1</span>');
        content = content.replace(/(&gt;)/g, '<span class="text-violet-400">$1</span>');
        
        return <div key={i} dangerouslySetInnerHTML={{ __html: content || ' ' }} />;
      })}
    </>
  );
}

function CodeBlock({ language, code }: { language: string, code: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 dark:bg-[#030712] ring-1 ring-white/5">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 tracking-wider">{language}</span>
        <button 
          onClick={handleCopy}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          {copied ? <><CheckCircle className="w-3.5 h-3.5 text-violet-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
        </button>
      </div>
      <div className="p-4 overflow-x-auto whitespace-pre">
        <code className="text-[13px] font-mono leading-relaxed text-zinc-700 dark:text-zinc-300">
          <SyntaxHighlighter code={code} />
        </code>
      </div>
    </div>
  );
}

export function IntegrationDocs() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scriptSnippet = `<script src="https://gazeta-network.com/gazeta-sdk.js"></script>`;
  const htmlSnippet = `<!-- The ad naturally fills its parent container. -->
<div style="width: 100vw; height: 100vh; position: fixed; inset: 0;">
  <gazeta-ad app-id="YOUR_APP_ID"></gazeta-ad>
</div>`;

  const bannerSnippet = `<!-- Native Banner Ad Example -->
<gazeta-ad 
  app-id="YOUR_APP_ID" 
  format="horizontal" 
  width="100%" 
  height="90px"
></gazeta-ad>`;

  const advancedSnippet = `<!-- Advanced Targeted Video Ad -->
<gazeta-ad 
  app-id="YOUR_APP_ID"
  target-age="18-35" 
  app-category="finance"
  format="video"
>
  <button slot="close-button" onclick="closeAd()">
    Close Ad
  </button>
</gazeta-ad>`;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-sans selection:bg-violet-500/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex">
        
        {/* Left Sidebar (Navigation Tree) */}
        <aside className="hidden lg:block w-64 shrink-0 py-10 pr-8 sticky top-0 h-screen overflow-y-auto">
          <nav className="space-y-8">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollTo('introduction')} className={`text-sm font-medium transition-colors ${activeSection === 'introduction' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>Introduction</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('prerequisites')} className={`text-sm font-medium transition-colors ${activeSection === 'prerequisites' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>Prerequisites</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Installation</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollTo('step-1')} className={`text-sm font-medium transition-colors ${activeSection === 'step-1' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>1. Load Core SDK</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('step-2')} className={`text-sm font-medium transition-colors ${activeSection === 'step-2' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>2. Mount Ad Unit</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('step-3')} className={`text-sm font-medium transition-colors ${activeSection === 'step-3' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>3. Place Banner Ad</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Configuration</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollTo('advanced')} className={`text-sm font-medium transition-colors ${activeSection === 'advanced' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>Properties Table</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('architecture')} className={`text-sm font-medium transition-colors ${activeSection === 'architecture' ? 'text-violet-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-200'}`}>Architecture & Errors</button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Center Column (Content Feed) */}
        <main className="flex-1 max-w-3xl py-10 lg:px-8 xl:px-12 animate-in fade-in duration-500">
          
          <section id="introduction" className="mb-16 scroll-mt-24">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">Gazeta SDK Documentation</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Integrate the Gazeta Ad Network into your application in minutes. No complex SDK initialization or bloated dependencies—just pure, high-performance web components.
            </p>
          </section>

          <hr className="border-zinc-800/50 mb-12" />

          <section id="prerequisites" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Prerequisites</h2>
            
            <div className="relative overflow-hidden bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex items-start gap-4">
              <Info className="w-6 h-6 text-amber-500 shrink-0 mt-0.5 absolute top-6 left-6" />
              <div className="pl-10">
                <h3 className="text-amber-500 font-bold mb-2">Get Your App ID</h3>
                <p className="text-amber-200/70 text-base font-medium leading-relaxed">
                  <strong className='text-zinc-900 dark:text-zinc-100 font-bold bg-amber-500/20 px-1 rounded'>Before embedding any ads</strong>, you must register your application in the Apps & Properties tab. Once registered, you will be given a unique <code className="bg-white dark:bg-zinc-950 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 text-[13px]">App ID</code>. You will need to replace <code className="bg-white dark:bg-zinc-950 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/20 text-[13px]">YOUR_APP_ID</code> in the snippets below with your actual ID.
                </p>
              </div>
            </div>
          </section>

          <section id="step-1" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm border border-violet-500/30">1</span>
              Load the Core SDK
            </h2>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Drop this script tag into the <code className="bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800 text-[13px]">&lt;head&gt;</code> of your website. This is a lightweight asynchronous script that registers the <code className="bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800 text-[13px]">&lt;gazeta-ad&gt;</code> web component globally.
            </p>
            <CodeBlock language="HTML" code={scriptSnippet} />
          </section>

          <section id="step-2" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm border border-violet-500/30">2</span>
              Mount the Ad Unit
            </h2>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Place this custom HTML tag exactly where you want the immersive video ad to render. The component is completely fluid and will automatically consume 100% of the width and height of its parent container.
            </p>
            <CodeBlock language="HTML" code={htmlSnippet} />
          </section>

          <section id="step-3" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm border border-violet-500/30">3</span>
              Placing a Native Banner Ad
            </h2>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              If you'd prefer a traditional, static banner instead of an immersive video, you can explicitly request a banner format. Banners will scale exactly to the dimensions you pass, natively rendering without any video UI overlays.
            </p>
            <CodeBlock language="HTML" code={bannerSnippet} />
          </section>

          <hr className="border-zinc-800/50 mb-12" />

          <section id="advanced" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Properties Configuration</h2>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              The <code className="bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800 text-[13px]">&lt;gazeta-ad&gt;</code> element supports several HTML attributes that allow you to control targeting and ad formats directly from the DOM.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-white dark:bg-zinc-950">
                    <th className="py-4 px-6 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Property</th>
                    <th className="py-4 px-6 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <tr>
                    <td className="py-5 px-6 align-top">
                      <code className="text-violet-400 font-mono text-[13px]">format</code>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Controls the ad layout. Accepts <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">video</code>, <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">horizontal</code>, <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">vertical</code>, or <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">square</code>. Banners seamlessly drop into your layout natively.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 align-top">
                      <code className="text-violet-400 font-mono text-[13px]">target-age</code>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Filters ad inventory to match your user demographic. Passing accurate ranges (e.g., <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">18-24</code>) drastically improves CTR.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 align-top">
                      <code className="text-violet-400 font-mono text-[13px]">app-category</code>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Restricts the types of ads shown. For example, pass <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-800/50 px-1 rounded">finance</code> to receive highly relevant financial ads.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 align-top">
                      <code className="text-violet-400 font-mono text-[13px]">slot="close-button"</code>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Inject a custom close button element inside the component for rewarded or dismissible ad flows.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock language="HTML" code={advancedSnippet} />
          </section>

          <section id="architecture" className="mb-24 scroll-mt-24">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Error Handling & Analytics</h2>
            <p className="text-base font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              The SDK is completely failure-resistant. If an ad fails to load due to network issues or inventory shortages, it gracefully collapses to a 1px transparent container, ensuring your layout is never broken.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <span className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-white">Zero-Latency:</strong> The component intelligently pre-fetches and caches heavy video assets to ensure 0ms network latency upon render.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <span className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-white">Intersection Tracking:</strong> Impressions are automatically logged when exactly 30% of the ad enters the viewport.
                </span>
              </li>
            </ul>
          </section>

        </main>

        {/* Right Sidebar (Table of Contents) */}
        <aside className="hidden xl:block w-56 shrink-0 py-10 pl-8 sticky top-0 h-screen overflow-y-auto border-l border-zinc-800/50 ml-8">
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-white mb-4">On This Page</h4>
          <ul className="space-y-3 border-l border-zinc-800">
            <li>
              <button 
                onClick={() => scrollTo('introduction')} 
                className={`text-[13px] font-medium block pl-4 -ml-[1px] border-l-2 transition-colors ${activeSection === 'introduction' ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
              >
                Introduction
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('prerequisites')} 
                className={`text-[13px] font-medium block pl-4 -ml-[1px] border-l-2 transition-colors ${activeSection === 'prerequisites' ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
              >
                Prerequisites
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('step-1')} 
                className={`text-[13px] font-medium block pl-4 -ml-[1px] border-l-2 transition-colors ${activeSection === 'step-1' || activeSection === 'step-2' || activeSection === 'step-3' ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
              >
                Installation
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('advanced')} 
                className={`text-[13px] font-medium block pl-4 -ml-[1px] border-l-2 transition-colors ${activeSection === 'advanced' ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
              >
                Properties Config
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('architecture')} 
                className={`text-[13px] font-medium block pl-4 -ml-[1px] border-l-2 transition-colors ${activeSection === 'architecture' ? 'border-violet-500 text-violet-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
              >
                Error Handling
              </button>
            </li>
          </ul>
        </aside>

      </div>
    </div>
  );
}
