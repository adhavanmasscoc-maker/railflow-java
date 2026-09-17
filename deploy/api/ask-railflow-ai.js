/**
 * Vercel Serverless Function: RailFlow AI Operations Assistant
 * Endpoint: /api/ask-railflow-ai
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_API_KEY || 
                       "";

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        let userPrompt = '';
        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            userPrompt = body.prompt || body.query || body.message || '';
        } else {
            userPrompt = req.query.prompt || req.query.q || '';
        }

        if (!userPrompt || !userPrompt.trim()) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const systemDirective = `You are "RAILFLOW AI", the authoritative Indian Railways Operations and Passenger Assistant.
Knowledge & Topology Ground Truth:
- Southern Railway (SR) Main Chord Line connects Tiruchirappalli (TPJ) and Chennai Egmore (MS) via Ariyalur (ALU), Vriddhachalam (VRI), Villupuram (VM), Chengalpattu (CGL), and Tambaram (TBM).
- Ariyalur (ALU) is on the Chord Line (~267 km from Chennai Egmore, ~70 km from TPJ). Key trains: 12638 Pandian SF Express, 12636 Vaigai SF Express, 12606 Pallavan SF Express, 12654 Rockfort SF Express, 16128 Guruvayur Express.
- Chennai Central (MAS) is the terminus for Bangalore, Mumbai, Delhi, and Howrah trunks.
- Chennai Egmore (MS) is the terminus for southern destinations (Madurai, Trichy, Tirunelveli, Kanyakumari).
- Incorporate comprehensive real Indian Railways knowledge across the web: Kavach TCAS, Vande Bharat, automated block signalling, platform layouts, and PNR rules.
- Format responses cleanly with Markdown headers, bold station codes, bullet points, and timings.`;

        const fullPrompt = `${systemDirective}\n\nUser Question: ${userPrompt.trim()}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig: { temperature: 0.25, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        res.status(200).json({ answer, status: 'success', model: 'gemini-2.5-flash' });
    } catch (error) {
        console.error('Serverless RailFlow AI error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
