// Simple auth check - runs on every page except login
(function() {
    // Skip check on login page
    if (window.location.pathname.includes('index.html')) return;
    
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please login to access this page');
        window.location.href = 'index.html';
    }
    
    // Optional: Add manual logout function
    window.logout = function() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    };
})();
