class GazetaAdWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      const appId = this.getAttribute('app-id');
      const targetAge = this.getAttribute('target-age') || 'all';
      const appCategory = this.getAttribute('app-category') || 'all';
      const width = this.getAttribute('width') || '300px';
      const height = this.getAttribute('height') || '600px';
  
      if (!appId) {
          this.shadowRoot.innerHTML = `<div style="color:red; font-family: sans-serif; padding: 1rem; border: 1px dashed red;">Gazeta SDK Error: Missing app-id</div>`;
          return;
      }

      this.shadowRoot.innerHTML = `
        <style>
            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${width};
                height: ${height};
                background: #0f172a;
                color: #94a3b8;
                font-family: system-ui, sans-serif;
                border-radius: 1.5rem;
            }
        </style>
        <div class="loading">Loading Gazeta Ad...</div>
      `;
  
      try {
        // Points to the new Project B Gateway
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
  
        this.renderAd(ad, width, height);
      } catch (e) {
        this.shadowRoot.innerHTML = `<div style="color:red; font-family: sans-serif; padding: 1rem; border: 1px dashed red;">Gazeta Ad Failed: ${e.message}</div>`;
      }
    }
  
    renderAd(ad, width, height) {
      // SVG Icons (equivalent to Lucide React icons used in AdPreview.tsx)
      const playIcon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
      const pauseIcon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
      const volumeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
      const mutedIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      const closeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      const infoIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  
      const isVideo = ad.file_type === 'video';
      const mediaHtml = isVideo 
          ? `<video id="adMedia" src="${ad.media_url}" autoplay loop muted playsinline></video>`
          : `<img id="adMedia" src="${ad.media_url}" alt="Ad" />`;
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          .gazeta-ad-container {
            font-family: system-ui, -apple-system, sans-serif;
            width: ${width};
            height: ${height};
            border-radius: 2rem;
            overflow: hidden;
            background: #000;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            box-sizing: border-box;
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
            padding: 2rem 1rem 1rem;
            background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
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
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
            border-radius: 9999px;
            padding: 4px 12px 4px 4px;
            pointer-events: auto;
          }
          .brand-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #0ea5e9;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
          }
          .brand-name { color: white; font-size: 12px; font-weight: 500; }
          .sponsored-tag { color: rgba(255,255,255,0.7); font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; }
          
          .top-actions { display: flex; gap: 8px; pointer-events: auto; }
          .circle-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .circle-btn:hover { background: rgba(0,0,0,0.6); }
  
          .bottom-ui {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 5rem 1rem 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent);
            z-index: 10;
          }
          .ad-info { color: white; margin-bottom: 1rem; }
          .ad-info h4 { font-size: 14px; font-weight: bold; margin: 0 0 4px; }
          .ad-info p { 
            font-size: 12px; 
            color: rgba(255,255,255,0.9); 
            margin: 0; 
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          }
          .cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            background: #0ea5e9;
            color: white;
            font-weight: bold;
            font-size: 14px;
            padding: 14px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
            transition: transform 0.1s;
            text-decoration: none;
          }
          .cta-btn:active { transform: scale(0.95); }
        </style>
  
        <div class="gazeta-ad-container">
            <div class="media-layer">
                ${mediaHtml}
            </div>
    
    
    
            <div class="top-ui">
                <div class="brand-badge">
                <div class="brand-icon" style="text-transform: uppercase;">${ad.ad_name ? ad.ad_name.charAt(0) : 'G'}</div>
                <span class="brand-name">${ad.ad_name || 'Gazeta'}</span>
                <span class="sponsored-tag">Sponsored</span>
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
    }
  }
  
  customElements.define('gazeta-ad', GazetaAdWidget);
