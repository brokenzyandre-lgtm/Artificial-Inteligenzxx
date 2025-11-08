// Developer Panel State Management
let currentUser = null;
let users = [];
let activities = [];
let currentSort = { field: 'id', direction: 'asc' };

// Initialize Developer Panel
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = '/index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    if (currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/chat.html';
        return;
    }
    
    document.getElementById('currentAdmin').textContent = currentUser.username;
    
    // Load data
    await loadUsers();
    await loadActivities();
    
    // Initialize dashboard
    updateDashboard();
    populateUserTable();
    populateActivityLog();
    
    // Setup auto-refresh
    setupAutoRefresh();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Add animations
    setupAnimations();
});

// Load Users
async function loadUsers() {
    try {
        const response = await fetch('./users.json');
        const data = await response.json();
        
        users = [
            { id: 1, username: data.admin.username, role: data.admin.role, status: 'online', lastLogin: new Date().toISOString() },
            ...data.users.map((user, index) => ({
                id: index + 2,
                username: user.username,
                role: user.role,
                status: Math.random() > 0.5 ? 'online' : 'offline',
                lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString()
            }))
        ];
        
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Failed to load users data');
    }
}

// Load Activities
async function loadActivities() {
    // Generate sample activities
    const activityTypes = [
        { icon: 'fa-user-plus', text: 'New user registered', color: 'success' },
        { icon: 'fa-sign-in-alt', text: 'User logged in', color: 'info' },
        { icon: 'fa-comments', text: 'Chat session started', color: 'primary' },
        { icon: 'fa-cog', text: 'System configuration updated', color: 'warning' },
        { icon: 'fa-shield-alt', text: 'Security scan completed', color: 'success' },
        { icon: 'fa-database', text: 'Database backup completed', color: 'info' },
        { icon: 'fa-chart-line', text: 'Performance report generated', color: 'primary' },
        { icon: 'fa-bell', text: 'System notification sent', color: 'warning' }
    ];
    
    activities = [];
    for (let i = 0; i < 20; i++) {
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        
        activities.push({
            id: i + 1,
            icon: activity.icon,
            text: activity.text + (user ? ` by ${user.username}` : ''),
            time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            color: activity.color
        });
    }
    
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// Update Dashboard
function updateDashboard() {
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalChats = Math.floor(Math.random() * 2000) + 1000;
    const activeNow = users.filter(u => u.status === 'online').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('totalChats').textContent = totalChats.toLocaleString();
    document.getElementById('activeNow').textContent = activeNow;
}

// Populate User Table
function populateUserTable() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        if (user.role === 'admin') {
            row.classList.add('admin');
        }
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>
                <span class="role-badge ${user.role}">
                    ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
            </td>
            <td>
                <span class="status-indicator ${user.status}"></span>
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </td>
            <td>${formatDateTime(user.lastLogin)}</td>
            <td>
                <button class="dev-btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="viewUser('${user.username}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Populate Activity Log
function populateActivityLog() {
    const activityList = document.getElementById('activityList');
    const fullActivityList = document.getElementById('fullActivityList');
    
    const populateList = (listId, count) => {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        
        activities.slice(0, count).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${formatTimeAgo(activity.time)}</div>
                </div>
            `;
            list.appendChild(item);
        });
    };
    
    populateList('activityList', 5);
    populateList('fullActivityList', 20);
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Toggle Mobile Sidebar
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show Page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        activity: 'Activity Log',
        settings: 'System Settings'
    };
    
    document.getElementById('pageTitle').textContent = titles[pageId];
    
    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

// Search Users
function searchUsers(query) {
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase()) ||
        user.status.toLowerCase().includes(query.toLowerCase())
    );
    
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        if (user.role === 'admin') {
            row.classList.add('admin');
        }
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>
                <span class="role-badge ${user.role}">
                    ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
            </td>
            <td>
                <span class="status-indicator ${user.status}"></span>
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </td>
            <td>${formatDateTime(user.lastLogin)}</td>
            <td>
                <button class="dev-btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="viewUser('${user.username}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Sort Table
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    
    users.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'id') {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        }
        
        if (currentSort.direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    populateUserTable();
}

// View User
function viewUser(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        showNotification('info', 'User Details', `Viewing details for ${username}`);
    }
}

// Export Users
function exportUsers() {
    showLoading();
    
    setTimeout(() => {
        const csvContent = 'data:text/csv;charset=utf-8,' +
            'ID,Username,Role,Status,Last Login\n' +
            users.map(user => 
                `${user.id},${user.username},${user.role},${user.status},${user.lastLogin}`
            ).join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'users_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        hideLoading();
        showNotification('success', 'Export Successful', 'Users data exported successfully');
    }, 1000);
}

// Refresh Data
async function refreshData() {
    showLoading();
    
    try {
        await loadUsers();
        await loadActivities();
        updateDashboard();
        populateUserTable();
        populateActivityLog();
        
        hideLoading();
        showNotification('success', 'Data Refreshed', 'All data has been refreshed successfully');
    } catch (error) {
        hideLoading();
        showError('Failed to refresh data');
    }
}

// Setup Auto Refresh
function setupAutoRefresh() {
    setInterval(() => {
        // Update random stats
        const activeNow = document.getElementById('activeNow');
        const currentValue = parseInt(activeNow.textContent);
        const change = Math.floor(Math.random() * 5) - 2;
        activeNow.textContent = Math.max(0, currentValue + change);
        
        // Add random activity
        if (Math.random() > 0.7) {
            const activityTypes = [
                { icon: 'fa-sign-in-alt', text: 'User logged in' },
                { icon: 'fa-comments', text: 'Chat session started' },
                { icon: 'fa-user-plus', text: 'New user registered' }
            ];
            
            const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            
            activities.unshift({
                id: activities.length + 1,
                icon: activity.icon,
                text: activity.text + (user ? ` by ${user.username}` : ''),
                time: new Date().toISOString(),
                color: 'info'
            });
            
            activities = activities.slice(0, 20);
            populateActivityLog();
        }
    }, 30000); // Update every 30 seconds
}

// Setup Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + R for refresh
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            refreshData();
        }
        
        // Ctrl/Cmd + E for export
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportUsers();
        }
        
        // Ctrl/Cmd + / for search focus
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Number keys for navigation
        if (event.key >= '1' && event.key <= '4' && !event.ctrlKey && !event.metaKey) {
            const pages = ['dashboard', 'users', 'activity', 'settings'];
            const pageIndex = parseInt(event.key) - 1;
            
            if (pageIndex < pages.length) {
                const navItem = document.querySelector(`[onclick="showPage('${pages[pageIndex]}')"]`);
                if (navItem) {
                    navItem.click();
                }
            }
        }
    });
}

// Setup Animations
function setupAnimations() {
    // Animate stat cards on hover
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate table rows
    document.querySelectorAll('.user-table tbody tr').forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('fade-in');
    });
    
    // Animate activity items
    document.querySelectorAll('.activity-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('slide-in');
    });
}

// Show Loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

// Hide Loading
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Show Notification
function showNotification(type, title, message) {
    const toast = document.getElementById('notificationToast');
    const icon = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');
    
    // Set icon and color based on type
    icon.className = `notification-icon ${type}`;
    if (type === 'success') {
        icon.innerHTML = '<i class="fas fa-check"></i>';
    } else if (type === 'error') {
        icon.innerHTML = '<i class="fas fa-times"></i>';
    } else if (type === 'info') {
        icon.innerHTML = '<i class="fas fa-info"></i>';
    }
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

// Hide Notification
function hideNotification() {
    const toast = document.getElementById('notificationToast');
    toast.classList.remove('show');
}

// Show Error
function showError(message) {
    showNotification('error', 'Error', message);
}

// Logout
function logout() {
    if (confirm('Apakah Anda ingin keluar dari panel admin?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    }
}

// Format Date Time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format Time Ago
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .fade-in {
        animation: fade-in 0.5s ease forwards;
    }
    
    .slide-in {
        animation: slide-in 0.5s ease forwards;
    }
`;
document.head.appendChild(animationStyles);

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
});

// Add page visibility detection
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh data when page becomes visible again
        refreshData();
    }
});

// Add online/offline detection
window.addEventListener('online', () => {
    showNotification('success', 'Connection Restored', 'Internet connection is back online');
});

window.addEventListener('offline', () => {
    showNotification('error', 'Connection Lost', 'Internet connection is offline');
});

// Add rainbow animation for admin rows
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow-border {
        0% { border-color: #ff0000; }
        16.66% { border-color: #ff7f00; }
        33.33% { border-color: #ffff00; }
        50% { border-color: #00ff00; }
        66.66% { border-color: #0000ff; }
        83.33% { border-color: #4b0082; }
        100% { border-color: #9400d3; }
    }
    
    .user-table tr.admin:hover {
        animation: rainbow-border 2s linear infinite;
    }
`;
document.head.appendChild(rainbowStyle);

// Add glow effect for active elements
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
        100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
    }
    
    .stat-card:hover {
        animation: glow 2s ease-in-out infinite;
    }
    
    .nav-item.active {
        animation: glow 3s ease-in-out infinite;
    }
`;
document.head.appendChild(glowStyle);