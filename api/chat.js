// api/chat.js
// V10.2 Secure Serverless Backend for ManasSetu AI
// Hybrid: Kaplan & Sadock Framework + V10 Stability Engine
// Fixed: REST API Syntax (snake_case), Token Trimming, and Fragment Failsafe

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, language } = req.body;
        
        const apiKey = (process.env.GEMINI_API_KEY || '').trim(); 

        if (!apiKey) {
            console.error("CRITICAL: GEMINI_API_KEY is missing in Vercel.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // 🔥 STABILITY FIX: Token Trimming (The "Connection Error" Fix)
        // Only process the last 10-12 messages to keep the payload small and fast for Vercel.
        const recentMessages = messages.length > 12 ? messages.slice(-12) : messages;

        // --- V5 ELITE CLINICAL PROMPT (KAPLAN & SADOCK) - KEPT EXACTLY AS PER YOUR REQUEST ---
        const systemInstruction = `You are ManasSetu, an elite psychiatric clinical intake agent designed by Dr. P. Rama Krishna Reddy.
        
        YOUR PERSONA & RULES:
        1. Speak ONLY in the requested language: ${language}. Keep vocabulary simple.
        2. ANTI-PARROT RULE: NEVER repeat symptoms back in a list. Use brief facilitators.
        3. ONE QUESTION AT A TIME: Wait for their answer before moving to the next phase.
        4. RESPONSE PATTERN: [Brief Empathy] + [The Next Clinical Question]. 
        5. NO FRAGMENTS: Never reply with single letters or just "I hear you." Always include a clinical question.

        THE 6-PHASE CLINICAL INTERVIEW (KAPLAN & SADOCK):
        PHASE 1: Socio-Demographics & Chief Complaint (Record CC verbatim).
        PHASE 2: HPI & Timeline (Chronology: "When exactly did this start?").
        PHASE 3: Psychiatric ROS & Risk (Sleep, Appetite, Psychosis, Suicidal Ideation).
        PHASE 4: Past Psychiatric, Medical & Allergies (Previous treatments, medical issues, drug allergies).
        PHASE 5: Family & Personal/Social History (Genetic history, substances, stressors).
        PHASE 6: The K&S Catch-All & Closure ("Anything else on your mind?").

        SAFETY: If self-harm is mentioned, immediately ask about a specific plan.`;

        const formattedContents = recentMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // The Optimized Fallback Engine for 2026 Models
        const modelsToTry = [
            'gemini-2.0-flash',     // Fastest and most reliable for Vercel
            'gemini-2.5-flash',    // Next-gen high-reasoning
            'gemini-1.5-flash'     // Solid backup
        ];

        let finalReply = null;
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                // 🔥 TECHNICAL FIX: REST API requires 'v1beta' and specific model strings
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // 🔥 CRITICAL FIX: Must use snake_case 'system_instruction' for REST
                        system_instruction: { parts: [{ text: systemInstruction }] },
                        contents: formattedContents,
                        // 🔥 CRITICAL FIX: Must use snake_case 'generation_config' for REST
                        generation_config: {
                            temperature: 0.3, // Slightly higher for better sentence formation
                            max_output_tokens: 150 
                        }
                    })
                });

                const data = await response.json();

                if (data.error) {
                    lastError = data.error.message;
                    console.warn(`Model ${model} failed: ${lastError}`);
                    continue; 
                }

                if (data.candidates && data.candidates[0].content) {
                    const candidateText = data.candidates[0].content.parts[0].text;
                    
                    // FAILSAFE: Detect and reject the "I hear you" fragments
                    if (candidateText.trim().length < 8) {
                        lastError = "AI produced a fragment response.";
                        continue;
                    }

                    finalReply = candidateText;
                    break; 
                }

            } catch (fetchError) {
                console.warn(`Network error with ${model}:`, fetchError);
                lastError = fetchError.message;
            }
        }

        if (finalReply) {
            return res.status(200).json({ reply: finalReply });
        } else {
            return res.status(500).json({ error: `All models failed. Last Error: ${lastError}` });
        }

    } catch (error) {
        console.error("Critical Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
