// Auth state management
let logoutTimer;

function generateAuthToken() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + 
           Date.now().toString(36);
}

function handleSuccessfulLogin(username) {
    // Generate and store auth token
    const authToken = generateAuthToken();
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('username', username);
    
    // Set session expiration (1 hour for regular users, 10 mins for guests)
    const expirationTime = username.toLowerCase() === 'guest' ? 
        Date.now() + 600000 : // 10 minutes
        Date.now() + 3600000; // 1 hour
    
    localStorage.setItem('tokenExpiry', expirationTime);
    
    // Start session timer
    startLogoutTimer(expirationTime - Date.now());
}

function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!authToken || !expiry || Date.now() > parseInt(expiry)) {
        localStorage.clear();
        window.location.replace('index.html');
        return false;
    }
    
    // Refresh the timer if token is valid
    const remainingTime = parseInt(expiry) - Date.now();
    if (remainingTime > 0) {
        startLogoutTimer(remainingTime);
        return true;
    }
    
    localStorage.clear();
    window.location.replace('index.html');
    return false;
}

function startLogoutTimer(duration) {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logout, duration);
}

function logout() {
    localStorage.clear();
    window.location.replace('index.html');
}

// Initialize auth check on page load
(function init() {
    // Skip auth check on login page
    if (window.location.pathname.includes('index.html')) return;
    
    if (!checkAuth()) {
        alert('Please login to access this page');
    }
})();