async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('data','users.json');
        const usersData = await response.json();
        
        if (username === usersData.admin.username && password === usersData.admin.password) {
            localStorage.setItem('currentUser', JSON.stringify({
                username: usersData.admin.username,
                role: usersData.admin.role
            }));
            window.location.href = 'developer.html';
            return;
        }
        
        const user = usersData.users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                role: user.role
            }));
            window.location.href = 'chat.html';
            return;
        }
        
        alert('Username atau password salah!');
    } catch (error) {
        console.error('Login error:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
}
