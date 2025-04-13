(function() {
    // Skip auth check on login page
    if (window.location.pathname.endsWith('index.html')) return;

    try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        
        // Check if auth data exists and isn't expired
        if (!authData || Date.now() > authData.expires) {
            localStorage.removeItem('auth');
            window.location.href = 'index.html';
            return;
        }

        // Set auto-logout timer
        const remainingTime = authData.expires - Date.now();
        if (remainingTime > 0) {
            setTimeout(() => {
                localStorage.removeItem('auth');
                window.location.href = 'index.html';
            }, remainingTime);
        }

    } catch (e) {
        console.error('Auth check failed:', e);
        localStorage.removeItem('auth');
        window.location.href = 'index.html';
    }
})();
