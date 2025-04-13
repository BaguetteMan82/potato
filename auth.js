(function() {
    // Skip auth check on login page
    if (window.location.pathname.includes('index.html')) return;

    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isAuthenticated) {
        alert('Please login to access this page');
        window.location.href = 'index.html';
        return;
    }

    // Set session timeout (matches login page logic)
    const timeout = username && username.toLowerCase() === 'guest' ? 600000 : 3600000;
    setTimeout(() => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    }, timeout);

    // Add logout functionality if needed
    window.logout = function() {
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    };
})();
