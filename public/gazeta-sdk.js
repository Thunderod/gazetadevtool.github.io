if (!window.Gazeta) {
  window.Gazeta = {
    pool: [],
    init: async function(appId, targetAge = 'all', appCategory = 'all') {
      try {
        const response = await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ app_id: appId, target_age: targetAge, app_category: appCategory })
        });
        const ads = await response.json();
        if (response.ok && ads && ads.length > 0) {
          ads.forEach(ad => {
             this.pool.push(ad);
             const link = document.createElement('link');
             link.rel = 'preload';
             link.href = ad.media_url;
             link.as = ad.file_type === 'video' ? 'video' : 'image';
             document.head.appendChild(link);
          });
        }
      } catch (e) {
        console.error("Gazeta init error:", e);
      }
    }
  };
}

class GazetaAdWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const appId = this.getAttribute('app-id');
    const targetAge = this.getAttribute('target-age') || 'all';
    const appCategory = this.getAttribute('app-category') || 'all';
    const format = this.getAttribute('format') || 'normal';

    const rootStyles = `
        :host {
          display: block;
          width: 100%;
          height: 100%;
          container-type: inline-size;
          container-name: gazeta-ad;
          
          /* Fluid Typography & Sizing Tokens */
          --gzt-radius: clamp(12px, 3cqi, 24px);
          --gzt-spacing: clamp(12px, 3.5cqi, 24px);
          --gzt-title: clamp(16px, 5cqi, 28px);
          --gzt-body: clamp(13px, 3.5cqi, 16px);
          --gzt-brand: clamp(10px, 2.5cqi, 14px);
          --gzt-btn-text: clamp(14px, 4cqi, 18px);
          --gzt-icon-size: clamp(24px, 7cqi, 36px);
          --gzt-circle-btn: clamp(32px, 9cqi, 48px);
          
          /* Safe Areas for Modern Devices */
          --gzt-safe-top: max(var(--gzt-spacing), env(safe-area-inset-top));
          --gzt-safe-bottom: max(var(--gzt-spacing), env(safe-area-inset-bottom));
          --gzt-safe-left: max(var(--gzt-spacing), env(safe-area-inset-left));
          --gzt-safe-right: max(var(--gzt-spacing), env(safe-area-inset-right));
        }
        
        * { box-sizing: border-box; }
        
        .gazeta-wrapper {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          height: 100%;
          border-radius: var(--gzt-radius);
          overflow: hidden;
          background: #000;
          position: relative;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          isolation: isolate;
        }

        .error-state {
          border: 2px dashed #ef4444;
          background: #fee2e2;
          color: #991b1b;
          padding: var(--gzt-spacing);
          text-align: center;
          justify-content: center;
          align-items: center;
          min-height: 150px;
        }
        .error-title { font-size: var(--gzt-title); font-weight: 800; margin-bottom: 8px; }
        .error-desc { font-size: var(--gzt-body); }
      `;

    if (!appId || appId === 'YOUR_APP_ID') {
      this.shadowRoot.innerHTML = `
            <style>${rootStyles}</style>
            <div class="gazeta-wrapper error-state">
              <div class="error-title">Gazeta SDK Error</div>
              <div class="error-desc">Please replace "YOUR_APP_ID" with your actual App ID from the dashboard.</div>
            </div>
          `;
      return;
    }

    this.shadowRoot.innerHTML = `
        <style>
            ${rootStyles}
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            .loading {
                background: linear-gradient(to right, #0f172a 4%, #1e293b 25%, #0f172a 36%);
                background-size: 1000px 100%;
                animation: shimmer 2s infinite linear;
            }
        </style>
        <div class="gazeta-wrapper loading"></div>
      `;

    // Zero-Latency Pre-fetching Check
    let preloadedAd = null;
    if (window.Gazeta && window.Gazeta.pool && window.Gazeta.pool.length > 0) {
      preloadedAd = window.Gazeta.pool.shift(); // take from front
    }

    if (preloadedAd) {
      this.renderAd(preloadedAd, appId, format, rootStyles);
      return;
    }

    try {
      const response = await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          target_age: targetAge,
          app_category: appCategory,
          format: format
        })
      });

      const jsonArray = await response.json();
      if (!response.ok) {
        const errDetail = jsonArray.error || jsonArray.message || JSON.stringify(jsonArray);
        throw new Error(errDetail || "Failed to fetch ad");
      }
      if (!jsonArray || jsonArray.length === 0) throw new Error("No active ads found that match criteria.");
      const ad = jsonArray[0];

      this.renderAd(ad, appId, format, rootStyles);
    } catch (e) {
      this.shadowRoot.innerHTML = `
          <style>${rootStyles}</style>
          <div class="gazeta-wrapper error-state" style="border-color: #ef4444; background: #1e1b4b; color: #fca5a5;">
            <div class="error-title">Gazeta Ad Error</div>
            <div class="error-desc">${e.message}</div>
          </div>
        `;
    }
  }

  async trackEvent(appId, eventType) {
    try {
      await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          event_type: eventType,
          event: eventType,
          action: eventType
        })
      });
    } catch (e) {
      console.error("Gazeta SDK tracking error:", e);
    }
  }

  renderAd(ad, appId, format, rootStyles) {
    // Scalable SVG Icons
    const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    const volumeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
    const mutedIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const infoIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    const isVideo = ad.file_type === 'video';

    // Dual-Layer Rendering Technique
    // Background layer is blurred and covers the container completely.
    // Foreground layer contains the content crisply, avoiding ugly letterboxing.
    const mediaHtml = isVideo
      ? `
             <video class="media-bg" src="${ad.media_url}" autoplay loop muted playsinline preload="auto"></video>
             <video class="media-fg" id="adMedia" src="${ad.media_url}" autoplay loop muted playsinline preload="auto"></video>
            `
      : `
             <img class="media-bg" src="${ad.media_url}" alt="" loading="eager" />
             <img class="media-fg" id="adMedia" src="${ad.media_url}" alt="Ad" loading="eager" />
            `;

    this.shadowRoot.innerHTML = `
        <style>
          ${rootStyles}
          
          .media-container {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            background: #000;
          }
          
          /* Dual Layer Implementation */
          .media-bg {
            position: absolute;
            inset: -10%; 
            width: 120%;
            height: 120%;
            object-fit: cover;
            filter: blur(24px) brightness(0.5);
            z-index: 1;
            transform: translate3d(0,0,0); /* GPU Acceleration */
          }
          
          .media-fg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            z-index: 2;
            transform: translate3d(0,0,0);
          }
  
          .ui-layer {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            pointer-events: none; /* Let clicks pass through to media if needed */
          }
  
          .top-bar {
            padding: var(--gzt-safe-top) var(--gzt-safe-right) var(--gzt-spacing) var(--gzt-safe-left);
            background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .brand-badge {
            display: flex;
            align-items: center;
            gap: calc(var(--gzt-spacing) * 0.5);
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 9999px;
            padding: calc(var(--gzt-spacing) * 0.25) calc(var(--gzt-spacing) * 0.75) calc(var(--gzt-spacing) * 0.25) calc(var(--gzt-spacing) * 0.25);
            pointer-events: auto;
          }
          
          .brand-icon {
            width: var(--gzt-icon-size);
            height: var(--gzt-icon-size);
            border-radius: 50%;
            background: #114B5F;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--gzt-brand);
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .brand-name { color: white; font-size: var(--gzt-brand); font-weight: 700; }
          .sponsored-tag { 
            color: rgba(255,255,255,0.85); 
            font-size: calc(var(--gzt-brand) * 0.85); 
            background: rgba(255,255,255,0.2); 
            padding: 2px 6px; 
            border-radius: 6px; 
            text-transform: uppercase; 
            font-weight: 800; 
            letter-spacing: 0.5px; 
          }
          
          .top-actions { display: flex; gap: calc(var(--gzt-spacing) * 0.5); pointer-events: auto; }
          .circle-btn {
            width: var(--gzt-circle-btn);
            height: var(--gzt-circle-btn);
            border-radius: 50%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
          }
          .circle-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.05); }
          .circle-btn:active { transform: scale(0.95); }
          .circle-btn svg { width: 50%; height: 50%; }
          
          .countdown-badge {
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            font-size: calc(var(--gzt-brand) * 1.1);
            font-weight: 700;
            padding: calc(var(--gzt-spacing) * 0.4) calc(var(--gzt-spacing) * 0.8);
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 80px;
            pointer-events: auto;
          }
          
          .close-slot-wrapper {
            display: none;
            pointer-events: auto;
          }
  
          .spacer { flex: 1; }
  
          .bottom-bar {
            padding: calc(var(--gzt-spacing) * 3) var(--gzt-safe-right) var(--gzt-safe-bottom) var(--gzt-safe-left);
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
            display: flex;
            flex-direction: column;
            gap: var(--gzt-spacing);
          }
          
          .ad-info { color: white; }
          .ad-title { 
            font-size: var(--gzt-title); 
            font-weight: 800; 
            margin: 0 0 calc(var(--gzt-spacing) * 0.3); 
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          .ad-desc { 
            font-size: var(--gzt-body); 
            color: rgba(255,255,255,0.9); 
            margin: 0; 
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          }
          
          .cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            background: #114B5F;
            color: white;
            font-weight: 700;
            font-size: var(--gzt-btn-text);
            padding: calc(var(--gzt-spacing) * 0.8) var(--gzt-spacing);
            border-radius: calc(var(--gzt-radius) * 0.75);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(17, 75, 95, 0.4);
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
            text-decoration: none;
            pointer-events: auto;
          }
          .cta-btn:hover { background: #1a627a; transform: translate3d(0, -2px, 0); box-shadow: 0 8px 20px rgba(17, 75, 95, 0.5); }
          .cta-btn:active { transform: translate3d(0, 1px, 0) scale(0.98); }
          .cta-btn svg { width: calc(var(--gzt-btn-text) * 1.2); height: calc(var(--gzt-btn-text) * 1.2); }

        </style>
  
        <div class="gazeta-wrapper">
            <div class="media-container">
                ${mediaHtml}
            </div>
    
            <div class="ui-layer">
                <div class="top-bar">
                    <div class="brand-badge">
                        <div class="brand-icon">${ad.ad_name ? ad.ad_name.charAt(0) : 'G'}</div>
                        <span class="brand-name">${ad.ad_name || 'Gazeta'}</span>
                        <span class="sponsored-tag">Ad</span>
                    </div>
                    <div class="top-actions">
                        ${isVideo ? `<button class="circle-btn" id="muteBtn">${mutedIcon}</button>` : ''}
                        <div class="countdown-badge" id="countdownBadge"></div>
                        <div class="close-slot-wrapper" id="closeSlotWrapper">
                            <slot name="close-button"><button class="circle-btn" onclick="this.getRootNode().host.remove()">${closeIcon}</button></slot>
                        </div>
                    </div>
                </div>
        
                <div class="spacer"></div>
        
                <div class="bottom-bar">
                    <div class="ad-info">
                        <h4 class="ad-title">Sponsored Content</h4>
                        <p class="ad-desc">${ad.ad_copy_description || ''}</p>
                    </div>
                    <a href="${ad.destination_url}" target="_blank" class="cta-btn">
                        ${ad.interaction_button} ${infoIcon}
                    </a>
                </div>
            </div>
        </div>
      `;

    const wrapper = this.shadowRoot.querySelector('.gazeta-wrapper');
    const fgMedia = this.shadowRoot.getElementById('adMedia');

    if (isVideo) {
      const muteBtn = this.shadowRoot.getElementById('muteBtn');
      let isMuted = true;
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        fgMedia.muted = isMuted;
        // Apply to background layer as well, just in case
        this.shadowRoot.querySelectorAll('video').forEach(v => v.muted = isMuted);
        muteBtn.innerHTML = isMuted ? mutedIcon : volumeIcon;
      });
    }

    // Tracking Logic
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.trackEvent(appId, 'impression');
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(wrapper);

    const ctaBtn = this.shadowRoot.querySelector('.cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => this.trackEvent(appId, 'click'));
    }

    // Skip Timer System
    const countdownBadge = this.shadowRoot.getElementById('countdownBadge');
    const closeSlotWrapper = this.shadowRoot.getElementById('closeSlotWrapper');

    if (format === 'banner') {
      countdownBadge.style.display = 'none';
      closeSlotWrapper.style.display = 'block';
    } else {
      const waitTime = format === 'rewarded' ? 30 : 5;
      let timeLeft = waitTime;
      
      countdownBadge.innerText = format === 'rewarded' ? `Reward in ${timeLeft}s` : `Skip in ${timeLeft}s`;
      
      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
          countdownBadge.innerText = format === 'rewarded' ? `Reward in ${timeLeft}s` : `Skip in ${timeLeft}s`;
        } else {
          clearInterval(timerInterval);
          countdownBadge.style.display = 'none';
          closeSlotWrapper.style.display = 'block';
          if (format === 'rewarded') {
             this.trackEvent(appId, 'reward_granted');
          }
        }
      }, 1000);
    }
  }
}

customElements.define('gazeta-ad', GazetaAdWidget);
