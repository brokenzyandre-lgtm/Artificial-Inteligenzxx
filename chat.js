// Chat State Management
let chatHistory = [];
let isTyping = false;
let currentUser = null;

// Initialize Chat
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = '/index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    document.getElementById('currentUser').textContent = currentUser.username;
    
    // Load chat history
    loadChatHistory();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Focus on input
    document.getElementById('chatInput').focus();
    
    // Add welcome animation
    setTimeout(() => {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.classList.add('fade-in');
        }
    }, 500);
});

// Load Chat History
function loadChatHistory() {
    const saved = localStorage.getItem(`chatHistory_${currentUser.username}`);
    if (saved) {
        chatHistory = JSON.parse(saved);
        renderMessages();
    }
}

// Save Chat History
function saveChatHistory() {
    localStorage.setItem(`chatHistory_${currentUser.username}`, JSON.stringify(chatHistory));
}

// Render Messages
function renderMessages() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear existing messages except welcome
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    chatMessages.innerHTML = '';
    
    if (welcomeMessage && chatHistory.length === 0) {
        chatMessages.appendChild(welcomeMessage);
    }
    
    chatHistory.forEach((message, index) => {
        const messageElement = createMessageElement(message);
        chatMessages.appendChild(messageElement);
        
        // Add animation
        setTimeout(() => {
            messageElement.classList.add('message-enter');
        }, index * 100);
    });
    
    // Scroll to bottom
    scrollToBottom();
}

// Create Message Element
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (message.type === 'gif') {
        if (message.gifUrl) {
            const img = document.createElement('img');
            img.src = message.gifUrl;
            img.style.cssText = 'max-width: 200px; border-radius: 10px; margin-bottom: 0.5rem;';
            contentDiv.appendChild(img);
        } else {
            const emoji = document.createElement('div');
            emoji.style.cssText = 'font-size: 3rem; margin-bottom: 0.5rem;';
            emoji.textContent = message.emoji;
            contentDiv.appendChild(emoji);
        }
    }
    
    if (message.content) {
        const textDiv = document.createElement('div');
        textDiv.textContent = message.content;
        contentDiv.appendChild(textDiv);
    }
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(message.timestamp);
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    return messageDiv;
}

// Send Message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Hide welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    // Add user message
    const userMessage = {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };
    
    chatHistory.push(userMessage);
    renderMessages();
    
    // Clear input
    input.value = '';
    autoResize(input);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const aiResponse = await getAIResponse(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI message
        const aiMessage = {
            type: 'ai',
            content: aiResponse,
            timestamp: new Date().toISOString()
        };
        
        chatHistory.push(aiMessage);
        renderMessages();
        
        // Save history
        saveChatHistory();
        
    } catch (error) {
        hideTypingIndicator();
        showError('Gagal mendapatkan respons AI. Silakan coba lagi.');
        console.error('AI Response Error:', error);
    }
}

// Get AI Response
async function getAIResponse(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory.slice(-10) // Send last 10 messages for context
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
        
    } catch (error) {
        // Fallback response if API fails
        return getFallbackResponse(message);
    }
}

// Fallback Response
function getFallbackResponse(message) {
    const responses = [
        "Saya Worm GPT, AI chat personal yang siap membantu Anda! Ada yang bisa saya bantu?",
        "Menarik! Ceritakan lebih lanjut tentang itu.",
        "Saya mengerti. Bagaimana pendapat Anda tentang hal ini?",
        "Itu pertanyaan yang bagus! Mari kita bahas bersama.",
        "Saya di sini untuk membantu. Apa yang ingin Anda ketahui?",
        "Wah, seru juga! Mari kita eksplorasi ide-ide menarik.",
        "Saya setuju dengan Anda. Ada tambahan lain?",
        "Terima kasih telah berbagi! Ada hal lain yang ingin dibahas?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Show Typing Indicator
function showTypingIndicator() {
    isTyping = true;
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.add('active');
    scrollToBottom();
}

// Hide Typing Indicator
function hideTypingIndicator() {
    isTyping = false;
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.remove('active');
}

// Send Quick Message
function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto Resize Textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Toggle GIF Panel
function toggleGifPanel() {
    const panel = document.getElementById('gifPanel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        document.getElementById('gifUrlInput').focus();
    }
}

// Send GIF
function sendGif(emoji) {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    const gifMessage = {
        type: 'gif',
        emoji: emoji,
        timestamp: new Date().toISOString()
    };
    
    chatHistory.push(gifMessage);
    renderMessages();
    saveChatHistory();
    
    // Close GIF panel
    document.getElementById('gifPanel').classList.remove('active');
}

// Send Custom GIF
function sendCustomGif() {
    const gifUrl = document.getElementById('gifUrlInput').value.trim();
    
    if (!gifUrl) {
        showError('Silakan masukkan URL GIF/stiker');
        return;
    }
    
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    const gifMessage = {
        type: 'gif',
        gifUrl: gifUrl,
        timestamp: new Date().toISOString()
    };
    
    chatHistory.push(gifMessage);
    renderMessages();
    saveChatHistory();
    
    // Clear input and close panel
    document.getElementById('gifUrlInput').value = '';
    document.getElementById('gifPanel').classList.remove('active');
}

// Insert Emoji
function insertEmoji() {
    const emojis = ['😀', '😂', '😍', '🤔', '😎', '🎉', '❤️', '👍', '🔥', '💯', '🚀', '💡'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const input = document.getElementById('chatInput');
    input.value += emoji;
    input.focus();
}

// New Chat
function newChat() {
    if (chatHistory.length > 0) {
        if (confirm('Apakah Anda ingin memulai chat baru? Chat saat ini akan disimpan.')) {
            saveChatHistory();
            chatHistory = [];
            renderMessages();
            
            // Show welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.display = 'block';
            }
        }
    }
}

// Clear Chat
function clearChat() {
    if (confirm('Apakah Anda yakin ingin menghapus semua chat?')) {
        chatHistory = [];
        localStorage.removeItem(`chatHistory_${currentUser.username}`);
        renderMessages();
        
        // Show welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
        }
    }
}

// Logout
function logout() {
    if (confirm('Apakah Anda ingin keluar?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    }
}

// Scroll to Bottom
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format Time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Show Error
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

// Setup Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + K for new chat
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            newChat();
        }
        
        // Ctrl/Cmd + L for clear chat
        if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
            event.preventDefault();
            clearChat();
        }
        
        // Ctrl/Cmd + / for GIF panel
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            toggleGifPanel();
        }
        
        // Escape to close GIF panel
        if (event.key === 'Escape') {
            const panel = document.getElementById('gifPanel');
            if (panel.classList.contains('active')) {
                panel.classList.remove('active');
            }
        }
        
        // = for GIF panel (as requested)
        if (event.key === '=' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            toggleGifPanel();
        }
    });
}

// Add button animations
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.chat-btn, .action-btn, .send-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add rainbow animation
            this.style.animation = 'rainbow 0.6s ease';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
});

// Add message hover effects
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    
    chatMessages.addEventListener('mouseover', (event) => {
        if (event.target.closest('.message')) {
            const message = event.target.closest('.message');
            message.style.transform = 'scale(1.02)';
            message.style.transition = 'transform 0.2s ease';
        }
    });
    
    chatMessages.addEventListener('mouseout', (event) => {
        if (event.target.closest('.message')) {
            const message = event.target.closest('.message');
            message.style.transform = 'scale(1)';
        }
    });
});

// Add typing animation to input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatInput');
    
    input.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.borderColor = '#10b981';
        } else {
            this.style.borderColor = '';
        }
    });
});

// Add online/offline status detection
window.addEventListener('online', () => {
    showError('Koneksi internet tersambung kembali');
});

window.addEventListener('offline', () => {
    showError('Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.');
});

// Add page visibility change detection
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again
        document.getElementById('chatInput').focus();
    }
});

// Add beforeunload event to save data
window.addEventListener('beforeunload', () => {
    saveChatHistory();
});

// Add rainbow animation for buttons
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { background: linear-gradient(45deg, #ff0000, #ff7f00); }
        16.66% { background: linear-gradient(45deg, #ff7f00, #ffff00); }
        33.33% { background: linear-gradient(45deg, #ffff00, #00ff00); }
        50% { background: linear-gradient(45deg, #00ff00, #0000ff); }
        66.66% { background: linear-gradient(45deg, #0000ff, #4b0082); }
        83.33% { background: linear-gradient(45deg, #4b0082, #9400d3); }
        100% { background: linear-gradient(45deg, #9400d3, #ff0000); }
    }
`;
document.head.appendChild(rainbowStyle);

// Add pulse animation for send button
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes sendPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .send-btn:hover {
        animation: sendPulse 0.6s ease infinite;
    }
`;
document.head.appendChild(pulseStyle);

// Add glow effect for GIF panel
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes panelGlow {
        0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
        100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
    }
    
    .gif-panel.active {
        animation: panelGlow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(glowStyle);