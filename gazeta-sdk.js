class GazetaAdWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      const appId = this.getAttribute('app-id');
      const targetAge = this.getAttribute('target-age') || 'all';
      const appCategory = this.getAttribute('app-category') || 'all';
      
      const rootStyles = `
        :host {
          display: block;
          width: 100%;
          height: 100%;
          container-type: size;
          container-name: gazeta-ad;
          
          /* Fluid Tokens: scale beautifully across tiny phones to huge desktop monitors */
          --gzt-spacing: clamp(12px, 3cqw, 32px);
          --gzt-title: clamp(18px, 5cqw, 32px);
          --gzt-body: clamp(14px, 3.5cqw, 20px);
          --gzt-brand: clamp(11px, 2.5cqw, 16px);
          --gzt-btn-text: clamp(15px, 4cqw, 22px);
          --gzt-icon-size: clamp(28px, 7cqw, 48px);
          --gzt-circle-btn: clamp(36px, 9cqw, 56px);
          --gzt-radius: clamp(12px, 3cqw, 24px);
          
          /* Safe Areas for Edge-to-Edge constraints */
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
          background: #000;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .error-state {
          border: 2px dashed #ef4444;
          background: #fee2e2;
          color: #991b1b;
          padding: var(--gzt-spacing);
          display: flex;
          flex-direction: column;
          text-align: center;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .error-title { font-size: var(--gzt-title); font-weight: 800; margin-bottom: 8px; }
        .error-desc { font-size: var(--gzt-body); }
      `;

      if (!appId || appId === 'YOUR_APP_ID') {
          this.shadowRoot.innerHTML = `
            <style>${rootStyles}</style>
            <div class="gazeta-wrapper">
              <div class="error-state">
                <div class="error-title">Gazeta SDK Error</div>
                <div class="error-desc">Please replace "YOUR_APP_ID" with your actual App ID from the dashboard.</div>
              </div>
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
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, #0f172a 4%, #1e293b 25%, #0f172a 36%);
                background-size: 1000px 100%;
                animation: shimmer 2s infinite linear;
            }
        </style>
        <div class="gazeta-wrapper">
            <div class="loading"></div>
        </div>
      `;
  
      try {
        const response = await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              app_id: appId,
              target_age: targetAge,
              app_category: appCategory
          })
        });
  
        const jsonArray = await response.json();
        if (!response.ok) {
            const errDetail = jsonArray.error || jsonArray.message || JSON.stringify(jsonArray);
            throw new Error(errDetail || "Failed to fetch ad");
        }
        if (!jsonArray || jsonArray.length === 0) throw new Error("No active ads found that match criteria.");
        const ad = jsonArray[0];
  
        this.renderAd(ad, appId, rootStyles);
      } catch (e) {
        this.shadowRoot.innerHTML = `
          <style>${rootStyles}</style>
          <div class="gazeta-wrapper">
            <div class="error-state" style="border-color: #ef4444; background: #1e1b4b; color: #fca5a5;">
              <div class="error-title">Gazeta Ad Error</div>
              <div class="error-desc">${e.message}</div>
            </div>
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
  
    renderAd(ad, appId, rootStyles) {
      const mutedIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      const volumeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
      const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      const infoIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  
      const isVideo = ad.file_type === 'video';
      
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
          
          /* Edge-to-Edge Media Layer */
          .media-container {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            background: #000;
          }
          
          .media-bg {
            position: absolute;
            inset: -10%; 
            width: 120%;
            height: 120%;
            object-fit: cover;
            filter: blur(28px) brightness(0.4);
            z-index: 1;
            transform: translate3d(0,0,0);
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
  
          /* Floating UI Overlay Layer */
          .ui-layer {
            position: absolute;
            inset: 0;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            pointer-events: none;
          }
  
          /* Top Pinned Bar */
          .top-bar {
            width: 100%;
            padding: var(--gzt-safe-top) var(--gzt-safe-right) calc(var(--gzt-spacing) * 2) var(--gzt-safe-left);
            background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            pointer-events: auto;
          }
          
          .brand-badge {
            display: flex;
            align-items: center;
            gap: calc(var(--gzt-spacing) * 0.5);
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 9999px;
            padding: calc(var(--gzt-spacing) * 0.25) calc(var(--gzt-spacing) * 0.75) calc(var(--gzt-spacing) * 0.25) calc(var(--gzt-spacing) * 0.25);
            border: 1px solid rgba(255,255,255,0.1);
          }
          
          .brand-icon {
            width: var(--gzt-icon-size);
            height: var(--gzt-icon-size);
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--gzt-brand);
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .brand-name { color: white; font-size: var(--gzt-brand); font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
          .sponsored-tag { 
            color: rgba(255,255,255,0.9); 
            font-size: calc(var(--gzt-brand) * 0.85); 
            background: rgba(255,255,255,0.2); 
            padding: 2px 6px; 
            border-radius: 4px; 
            text-transform: uppercase; 
            font-weight: 800; 
            letter-spacing: 0.5px; 
          }
          
          .top-actions { display: flex; gap: calc(var(--gzt-spacing) * 0.5); }
          .circle-btn {
            width: var(--gzt-circle-btn);
            height: var(--gzt-circle-btn);
            border-radius: 50%;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
          }
          .circle-btn:hover { background: rgba(0,0,0,0.6); transform: scale(1.05); }
          .circle-btn:active { transform: scale(0.95); }
          .circle-btn svg { width: 50%; height: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
  
          /* Bottom Pinned Bar */
          .bottom-bar {
            width: 100%;
            padding: calc(var(--gzt-spacing) * 4) var(--gzt-safe-right) var(--gzt-safe-bottom) var(--gzt-safe-left);
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
            display: flex;
            flex-direction: column;
            gap: var(--gzt-spacing);
            pointer-events: auto;
          }
          
          .ad-info { color: white; display: flex; flex-direction: column; gap: calc(var(--gzt-spacing) * 0.4); }
          .ad-title { 
            font-size: var(--gzt-title); 
            font-weight: 800; 
            margin: 0; 
            line-height: 1.2;
            text-shadow: 0 2px 6px rgba(0,0,0,0.8);
          }
          .ad-desc { 
            font-size: var(--gzt-body); 
            color: rgba(255,255,255,0.95); 
            margin: 0; 
            line-height: 1.5;
            text-shadow: 0 1px 4px rgba(0,0,0,0.8);
            /* Natural wrapping without artificial truncation to fit any screen safely */
          }
          
          .cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: calc(var(--gzt-spacing) * 0.5);
            width: 100%;
            background: #fff;
            color: #000;
            font-weight: 800;
            font-size: var(--gzt-btn-text);
            padding: calc(var(--gzt-spacing) * 0.9) var(--gzt-spacing);
            border-radius: var(--gzt-radius);
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
            text-decoration: none;
          }
          .cta-btn:hover { background: #f1f5f9; transform: translate3d(0, -2px, 0); }
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
                        <button class="circle-btn" onclick="this.getRootNode().host.remove()">${closeIcon}</button>
                    </div>
                </div>
        
                <div class="bottom-bar">
                    <div class="ad-info">
                        <h4 class="ad-title">Sponsored</h4>
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
      
      if (isVideo) {
        const fgMedia = this.shadowRoot.getElementById('adMedia');
        const muteBtn = this.shadowRoot.getElementById('muteBtn');
        let isMuted = true;
        muteBtn.addEventListener('click', () => {
          isMuted = !isMuted;
          fgMedia.muted = isMuted;
          this.shadowRoot.querySelectorAll('video').forEach(v => v.muted = isMuted);
          muteBtn.innerHTML = isMuted ? mutedIcon : volumeIcon;
        });

        // Track Video Progress Percentages
        const trackedMilestones = new Set();
        fgMedia.addEventListener('timeupdate', () => {
          if (!fgMedia.duration) return;
          const percentage = (fgMedia.currentTime / fgMedia.duration) * 100;
          
          if (percentage > 0 && !trackedMilestones.has('video_start')) {
            trackedMilestones.add('video_start');
            this.trackEvent(appId, 'video_start');
          }
          if (percentage >= 25 && !trackedMilestones.has('video_25_percent')) {
            trackedMilestones.add('video_25_percent');
            this.trackEvent(appId, 'video_25_percent');
          }
          if (percentage >= 50 && !trackedMilestones.has('video_50_percent')) {
            trackedMilestones.add('video_50_percent');
            this.trackEvent(appId, 'video_50_percent');
          }
          if (percentage >= 75 && !trackedMilestones.has('video_75_percent')) {
            trackedMilestones.add('video_75_percent');
            this.trackEvent(appId, 'video_75_percent');
          }
          // Using >= 99% because videos with the 'loop' attribute sometimes reset before hitting exactly 100%
          if (percentage >= 99 && !trackedMilestones.has('video_complete')) {
            trackedMilestones.add('video_complete');
            this.trackEvent(appId, 'video_complete');
          }
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
    }
  }
  
  customElements.define('gazeta-ad', GazetaAdWidget);
