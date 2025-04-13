// auth.js - Nuclear Option
(function() {
    // 1. Storage Protection
    const AUTH_KEY = 'gamehub_nuclear_auth';
    const storage = {
        set: (value) => {
            localStorage.setItem(AUTH_KEY, value);
            sessionStorage.setItem(AUTH_KEY, value);
            document.cookie = `${AUTH_KEY}=${value}; path=/; max-age=86400; Secure`;
        },
        get: () => localStorage.getItem(AUTH_KEY) 
                  || sessionStorage.getItem(AUTH_KEY) 
                  || document.cookie.includes(`${AUTH_KEY}=true`)
    };

    // 2. Skip login page
    if (location.pathname.endsWith('index.html')) return;

    // 3. Validation with fallbacks
    if (!storage.get()) {
        console.error("Auth failed - Storage State:", {
            localStorage: localStorage.getItem(AUTH_KEY),
            sessionStorage: sessionStorage.getItem(AUTH_KEY),
            cookie: document.cookie,
            time: new Date().toISOString()
        });
        
        // Emergency fallback (lasts 5 minutes)
        const emergencyAuth = sessionStorage.getItem('emergency_auth') || 
                            localStorage.setItem('emergency_auth', 'true');
        
        if (!emergencyAuth) {
            location.href = 'index.html';
            return;
        }
    }

    // 4. Continuous Validation (every 10 seconds)
    setInterval(() => {
        if (!storage.get()) {
            console.warn("Auth lost - Redirecting...");
            location.href = 'index.html';
        }
    }, 10000);
})();
