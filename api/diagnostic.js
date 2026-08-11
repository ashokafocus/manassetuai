// api/diagnostic.js
// Diagnostic tool to list all models supported by your API Key

export default async function handler(req, res) {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
        return res.status(500).json({ error: "API Key missing in Vercel environment variables." });
    }

    try {
        // We check the v1beta endpoint for the full list
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ 
                error: "Google API rejected the request", 
                details: data.error 
            });
        }

        // We filter for models that actually support generating content
        const supportedModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => ({
                name: m.name,
                displayName: m.displayName,
                description: m.description,
                version: m.version
            }));

        return res.status(200).json({
            message: "Successfully fetched supported models",
            count: supportedModels.length,
            models: supportedModels
        });

    } catch (error) {
        return res.status(500).json({ error: "Failed to connect to Google", details: error.message });
    }
}
