// api/deepgram.js
// V8.3 Secure Token Generator for Deepgram STT
// Updated Scopes for Nova-2 Compatibility

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    const projectId = process.env.DEEPGRAM_PROJECT_ID;

    if (!apiKey || !projectId) {
        console.error("CRITICAL: Deepgram credentials missing in Vercel.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Ask Deepgram for a temporary 10-minute pass
        const response = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: "Temporary Frontend Key for Patient Session",
                // 🔥 ARCHITECT FIX: Added read:projects scope for Nova-2 verification
                scopes: ["usage:write", "read:projects"],
                time_to_live_in_seconds: 600 
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Deepgram Token Error:", data.error);
            return res.status(500).json({ error: 'Failed to generate secure token' });
        }

        return res.status(200).json({ key: data.key });

    } catch (error) {
        console.error("Critical Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
