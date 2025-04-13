(function() {
    // Skip auth check on login page
    if (window.location.pathname.endsWith('index.html')) return;

    // Check authentication
    try {
        const authData = localStorage.getItem('auth');
        if (!authData) {
            redirectToLogin();
            return;
        }

        const { username, expires } = JSON.parse(authData);
        
        // Check if session expired
        if (Date.now() > expires) {
            localStorage.removeItem('auth');
            redirectToLogin();
            return;
        }

        // Set auto-logout timer
        const remainingTime = expires - Date.now();
        if (remainingTime > 0) {
            setTimeout(() => {
                localStorage.removeItem('auth');
                redirectToLogin();
            }, remainingTime);
        }

    } catch (e) {
        console.error('Auth check failed:', e);
        redirectToLogin();
    }

    function redirectToLogin() {
        // Only redirect if not already on login page
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
})();
