(function() {
    // Skip check on login page
    if (window.location.pathname.includes('index.html')) return;
    
    // Triple verification system
    const isAuthenticated = (
        localStorage.getItem('gamehub_auth') === 'true' ||
        sessionStorage.getItem('gamehub_auth') === 'true' ||
        document.cookie.includes('gamehub_auth=true')
    );
    
    console.log("Authentication Check:", {
        localStorage: localStorage.getItem('gamehub_auth'),
        sessionStorage: sessionStorage.getItem('gamehub_auth'),
        cookies: document.cookie,
        result: isAuthenticated ? "AUTHENTICATED" : "NOT AUTHENTICATED"
    });
    
    if (!isAuthenticated) {
        console.warn("Not authenticated - redirecting to login...");
        window.location.href = 'index.html';
    }
    
    // Manual logout function
    window.logout = function() {
        localStorage.removeItem('gamehub_auth');
        sessionStorage.removeItem('gamehub_auth');
        document.cookie = "gamehub_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = 'index.html';
    };
})();
