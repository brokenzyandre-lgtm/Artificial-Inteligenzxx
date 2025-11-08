async function handleLogin(event) {
    event.preventDefault();

    const loginBtn = document.querySelector('.login-submit');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
    loginBtn.disabled = true;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('data/users.json');
        if (!response.ok) throw new Error('Gagal load users.json');

        const usersData = await response.json();

        if (username === usersData.admin.username && password === usersData.admin.password) {
            localStorage.setItem('currentUser', JSON.stringify({ username, role: 'admin' }));
            window.location.href = 'developer.html';
        } else {
            const user = usersData.users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ username, role: 'user' }));
                window.location.href = 'chat.html';
            } else {
                alert('Username atau password salah!');
            }
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan login');
    } finally {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}