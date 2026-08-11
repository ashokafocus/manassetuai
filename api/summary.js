// api/summary.js
// Vercel Backend - Generates Clinical Reports from Transcripts

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { transcript } = req.body;
        const apiKey = (process.env.GEMINI_API_KEY || '').trim(); 

        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // --- CHIEF PSYCHIATRIST PROMPT ---
        const systemInstruction = `You are an elite Chief Psychiatrist. Your job is to read a raw intake transcript between an AI and a patient, and convert it into a highly professional, structured clinical summary in English. 

        Please format your response using HTML tags (like <b>, <ul>, <li>, <br>) so it looks beautiful on a web page. 

        Structure your report EXACTLY like this:
        <b>CHIEF COMPLAINT:</b> (1-2 sentences)
        <br><br>
        <b>HISTORY OF PRESENT ILLNESS:</b> (Summarize the key symptoms, duration, and context)
        <br><br>
        <b>PSYCHIATRIC REVIEW OF SYSTEMS:</b> (List sleep, appetite, energy, etc., based ONLY on what was said)
        <br><br>
        <b>RISK ASSESSMENT:</b> (Note any mention of self-harm or hopelessness, or state "Not fully assessed")
        <br><br>
        <b>PROVISIONAL CLINICAL IMPRESSION:</b> (Give 1-2 potential provisional diagnoses based on the data. Add a disclaimer that this is AI-generated and requires physician verification).`;

        // We combine the whole transcript into one block of text for the AI to read
        const fullConversationText = transcript.map(msg => 
            `${msg.role === 'assistant' ? 'ManasSetu AI' : 'Patient'}: ${msg.content}`
        ).join('\n');

        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-pro'];
        let finalReply = null;

        for (const model of modelsToTry) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemInstruction }] },
                        contents: [{ role: 'user', parts: [{ text: `Here is the transcript to analyze:\n\n${fullConversationText}` }] }],
                        generationConfig: { temperature: 0.2 } // Low temperature for highly clinical, factual output
                    })
                });

                const data = await response.json();
                if (!data.error) {
                    finalReply = data.candidates[0].content.parts[0].text;
                    break; 
                }
            } catch (e) { console.warn(`Model failed: ${model}`); }
        }

        if (finalReply) {
            return res.status(200).json({ report: finalReply });
        } else {
            return res.status(500).json({ error: `Failed to generate AI summary.` });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
