export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            
            if (url.pathname === '/api/verify') {
                return handleVerification(request, env);
            }
            
            return new Response('Not found', { status: 404 });
        } catch (err) {
            return new Response(err.stack, { status: 500 });
        }
    }
};

async function handleVerification(request, env) {
    try {
        const { token } = await request.json();
        
        // Validate Turnstile token
        const formData = new FormData();
        formData.append('secret', env.TURNSTILE_SECRET_KEY);
        formData.append('response', token);
        
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData
        });
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.success) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid verification token'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Verification successful - store in KV
        const userIP = request.headers.get('CF-Connecting-IP');
        await env.VERIFIED_USERS.put(userIP, 'verified', {
            expirationTtl: 86400 // 24 hours
        });
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Verification successful!'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
