class GazetaAdWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      const appId = this.getAttribute('app-id');
      const targetAge = this.getAttribute('target-age') || 'all';
      const appCategory = this.getAttribute('app-category') || 'all';
      
      const widthAttr = this.getAttribute('width') || '300px';
      const heightAttr = this.getAttribute('height') || '600px';
  
      // Safe parsing for CSS
      const wMatch = widthAttr.match(/(\d+)/);
      const hMatch = heightAttr.match(/(\d+)/);
      const parsedWidth = wMatch ? parseInt(wMatch[1]) : 300;
      const parsedHeight = hMatch ? parseInt(hMatch[1]) : 600;
      
      // Prevent bizarre aspect ratios on mobile if 100% is passed
      const isFluidWidth = widthAttr.includes('%');
      const aspectRatio = isFluidWidth ? '300 / 600' : `${parsedWidth} / ${parsedHeight}`;

      const containerStyle = `
        font-family: system-ui, -apple-system, sans-serif;
        width: 100%;
        max-width: ${isFluidWidth ? '100%' : widthAttr};
        aspect-ratio: ${aspectRatio};
        height: auto;
        min-height: 250px;
        max-height: 85vh;
        border-radius: 16px;
        overflow: hidden;
        background: #0f172a;
        position: relative;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      `;

      if (!appId || appId === 'YOUR_APP_ID') {
          this.shadowRoot.innerHTML = `
            <div style="${containerStyle}; border: 2px dashed #ef4444; background: #fee2e2; color: #991b1b; padding: 1.5rem; text-align: center; flex-direction: column; aspect-ratio: auto; min-height: 150px;">
              <strong style="font-size: 16px; margin-bottom: 8px;">Gazeta SDK Error</strong>
              <span style="font-size: 14px;">Please replace "YOUR_APP_ID" with your actual App ID from the dashboard.</span>
            </div>
          `;
          return;
      }

      this.shadowRoot.innerHTML = `
        <style>
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            .loading {
                ${containerStyle}
                background: linear-gradient(to right, #0f172a 4%, #1e293b 25%, #0f172a 36%);
                background-size: 1000px 100%;
                animation: shimmer 2s infinite linear;
            }
        </style>
        <div class="loading"></div>
      `;
  
      try {
        const response = await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json"
          },
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
  
        this.renderAd(ad, containerStyle, appId);
      } catch (e) {
        this.shadowRoot.innerHTML = `
          <div style="${containerStyle}; border: 1px solid #ef4444; background: #1e1b4b; color: #fca5a5; padding: 1.5rem; text-align: center; flex-direction: column; aspect-ratio: auto; min-height: 150px;">
            <strong style="margin-bottom: 8px;">Gazeta Ad Error</strong>
            <span style="font-size: 13px;">${e.message}</span>
          </div>
        `;
      }
    }
  
    async trackEvent(appId, eventType) {
      try {
        await fetch("https://hvoubbgzntldqoxqyoij.supabase.co/functions/v1/serve-ad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Sending multiple key variations just in case the edge function expects a different one
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
  
    renderAd(ad, containerStyle, appId) {
      const playIcon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
      const pauseIcon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
      const volumeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
      const mutedIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      const closeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      const infoIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  
      const isVideo = ad.file_type === 'video';
      // Preload media to reduce perceived delay
      const mediaHtml = isVideo 
          ? `<video id="adMedia" src="${ad.media_url}" autoplay loop muted playsinline preload="auto"></video>`
          : `<img id="adMedia" src="${ad.media_url}" alt="Ad" loading="eager" />`;
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: 100%;
          }
          .gazeta-ad-container {
            ${containerStyle}
          }
          
          * { box-sizing: border-box; }
          
          .media-layer {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1e293b;
          }
          .media-layer video, .media-layer img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
  
          .gazeta-ad-container:hover .controls-overlay {
            opacity: 1;
          }
  
          .top-ui {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            pointer-events: none;
          }
          .brand-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            border-radius: 9999px;
            padding: 4px 12px 4px 4px;
            pointer-events: auto;
          }
          .brand-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #114B5F;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
          }
          .brand-name { color: white; font-size: 12px; font-weight: 600; }
          .sponsored-tag { color: rgba(255,255,255,0.7); font-size: 10px; background: rgba(255,255,255,0.15); padding: 3px 6px; border-radius: 6px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
          
          .top-actions { display: flex; gap: 8px; pointer-events: auto; }
          .circle-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
          }
          .circle-btn:hover { background: rgba(0,0,0,0.8); }
  
          .bottom-ui {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 4rem 1.5rem 1.5rem;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5), transparent);
            z-index: 10;
          }
          .ad-info { color: white; margin-bottom: 1rem; }
          .ad-info h4 { font-size: 16px; font-weight: bold; margin: 0 0 6px; }
          .ad-info p { 
            font-size: 13px; 
            color: rgba(255,255,255,0.85); 
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
            font-weight: 600;
            font-size: 15px;
            padding: 14px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(17, 75, 95, 0.4);
            transition: all 0.2s ease;
            text-decoration: none;
          }
          .cta-btn:hover { background: #1a627a; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(17, 75, 95, 0.5); }
          .cta-btn:active { transform: translateY(1px) scale(0.98); }
        </style>
  
        <div class="gazeta-ad-container">
            <div class="media-layer">
                ${mediaHtml}
            </div>
    
            <div class="top-ui">
                <div class="brand-badge">
                <div class="brand-icon" style="text-transform: uppercase;">${ad.ad_name ? ad.ad_name.charAt(0) : 'G'}</div>
                <span class="brand-name">${ad.ad_name || 'Gazeta'}</span>
                <span class="sponsored-tag">Ad</span>
                </div>
                <div class="top-actions">
                ${isVideo ? `
                <button class="circle-btn" id="muteBtn">
                    ${mutedIcon}
                </button>
                ` : ''}
                <button class="circle-btn" onclick="this.getRootNode().host.remove()">
                    ${closeIcon}
                </button>
                </div>
            </div>
    
            <div class="bottom-ui">
                <div class="ad-info">
                <h4>Sponsored Content</h4>
                <p>${ad.ad_copy_description || ''}</p>
                </div>
                <a href="${ad.destination_url}" target="_blank" class="cta-btn">
                ${ad.interaction_button} ${infoIcon}
                </a>
            </div>
        </div>
      `;
  
      if (isVideo) {
        const media = this.shadowRoot.getElementById('adMedia');
        const muteBtn = this.shadowRoot.getElementById('muteBtn');
        
        let isMuted = true;
  
        muteBtn.addEventListener('click', () => {
          isMuted = !isMuted;
          media.muted = isMuted;
          muteBtn.innerHTML = isMuted ? mutedIcon : volumeIcon;
        });
      }

      // Track Impression
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.trackEvent(appId, 'impression');
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      
      observer.observe(this.shadowRoot.querySelector('.gazeta-ad-container'));

      // Track Click
      const ctaBtn = this.shadowRoot.querySelector('.cta-btn');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          this.trackEvent(appId, 'click');
        });
      }
    }
  }
  
  customElements.define('gazeta-ad', GazetaAdWidget);
