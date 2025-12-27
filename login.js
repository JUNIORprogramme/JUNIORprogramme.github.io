// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    // Simple authentication (you can customize these credentials)
    const validUsername = 'admin';
    const validPassword = 'admin123';
    
    if (username === validUsername && password === validPassword) {
        // Store login status in localStorage
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('loginTimestamp', Date.now().toString());
        
        // Redirect to admin page
        window.location.href = 'admin.html';
    } else {
        // Show error message
        errorMessage.textContent = 'Invalid username or password. Please try again.';
        errorMessage.style.display = 'block';
        
        // Clear password field
        document.getElementById('password').value = '';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Clear error message when user types
document.getElementById('username')?.addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('password')?.addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});
