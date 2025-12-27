// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    
    // Session expires after 24 hours (86400000 milliseconds)
    const sessionDuration = 24 * 60 * 60 * 1000;
    const currentTime = Date.now();
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    
    if (loginTimestamp) {
        const timeElapsed = currentTime - parseInt(loginTimestamp);
        if (timeElapsed > sessionDuration) {
            // Session expired, clear and redirect
            logout();
            return false;
        }
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('loginTimestamp');
    window.location.href = 'login.html';
}

// Add logout button to admin page
function addLogoutButton() {
    const navbar = document.querySelector('.nav-menu');
    if (navbar && localStorage.getItem('isAdminLoggedIn') === 'true') {
        const logoutItem = document.createElement('li');
        logoutItem.innerHTML = '<a href="#" id="logoutBtn" style="color: #e74c3c;">Logout</a>';
        navbar.appendChild(logoutItem);
        
        document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

// Run auth check if on admin page
if (window.location.pathname.includes('admin.html')) {
    checkAuth();
    addLogoutButton();
}
