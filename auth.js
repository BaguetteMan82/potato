// auth.js
(function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');

    if (!isLoggedIn) {
        alert("You're not logged in!");
        window.location.replace('index.html');
    } else {
        const sessionDuration = username.toLowerCase() === 'guest' ? 600000 : 3600000;
        startLogoutTimer(sessionDuration);
    }

    function startLogoutTimer(duration) {
        setTimeout(() => {
            localStorage.clear();
            alert('Session expired. You have been logged out.');
            window.location.replace('index.html');
        }, duration);
    }
})();
