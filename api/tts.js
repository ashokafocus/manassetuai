// api/tts.js
// V4 Secure Audio Backend for ManasSetu AI
// Converts AI text into Human-Grade Neural Audio

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();

        if (!apiKey) {
            return res.status(500).json({ error: 'API key missing' });
        }

        console.log("Generating human-grade audio for:", text.substring(0, 30) + "...");

        // Call Google's bleeding-edge Text-to-Speech API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: { 
                            // Aoede is a warm, empathetic neural voice
                            prebuiltVoiceConfig: { voiceName: "Aoede" } 
                        }
                    }
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("TTS API Error:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        // Google returns raw PCM16 audio waves. We send it straight to the phone!
        const inlineData = data.candidates[0].content.parts[0].inlineData;
        
        return res.status(200).json({
            audioBase64: inlineData.data,
            mimeType: inlineData.mimeType // Tells the phone the sample rate (e.g. 24000Hz)
        });

    } catch (error) {
        console.error("Critical TTS Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
