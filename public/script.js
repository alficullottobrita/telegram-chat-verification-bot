document.addEventListener('DOMContentLoaded', () => {
    const verificationStatus = document.getElementById('verification-status');
    const chatStatus = document.getElementById('chat-status');
    const statusIcon = document.getElementById('status-icon');
    const startChatBtn = document.getElementById('start-chat-btn');
    
    // Initialize Turnstile
    turnstile.ready(() => {
        turnstile.render('#turnstile-widget', {
            sitekey: 'YOUR_TURNSTILE_SITEKEY',
            callback: function(token) {
                verificationStatus.innerHTML = '<p>✅ Verification submitted. Processing...</p>';
                verifyToken(token);
            },
            'expired-callback': function() {
                verificationStatus.innerHTML = '<p>❌ Verification expired. Please try again.</p>';
            },
            'error-callback': function() {
                verificationStatus.innerHTML = '<p>❌ Verification error. Please try again.</p>';
            }
        });
    });
    
    // Verify token with Cloudflare Worker
    async function verifyToken(token) {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            
            const result = await response.json();
            
            if (result.success) {
                verificationStatus.innerHTML = '<p>✅ Human verification successful!</p>';
                statusIcon.textContent = '✅';
                chatStatus.textContent = 'You can now start chatting!';
                startChatBtn.disabled = false;
                startChatBtn.textContent = 'Start Chatting Now';
                
                // Store verification status in localStorage
                localStorage.setItem('telegram-verified', 'true');
            } else {
                verificationStatus.innerHTML = `<p>❌ Verification failed: ${result.message}</p>`;
                turnstile.reset();
            }
        } catch (error) {
            verificationStatus.innerHTML = '<p>❌ Network error. Please try again.</p>';
            console.error('Verification error:', error);
        }
    }
    
    // Start chat button handler
    startChatBtn.addEventListener('click', () => {
        window.open('https://t.me/YourBotUsername', '_blank');
    });
    
    // Check if already verified
    if (localStorage.getItem('telegram-verified') === 'true') {
        statusIcon.textContent = '✅';
        chatStatus.textContent = 'You are verified to chat!';
        startChatBtn.disabled = false;
        startChatBtn.textContent = 'Start Chatting Now';
        verificationStatus.innerHTML = '<p>✅ You have already completed verification</p>';
    }
});
