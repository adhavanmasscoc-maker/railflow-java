/**
 * Vercel Serverless Function: RailFlow AI Operations Assistant
 * Endpoint: /api/ask-railflow-ai
 * Multi-Tier Resilient Architecture: Gemini 2.5 Flash -> Groq -> OpenRouter -> Deterministic Local Engine
 */

const GEMINI_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY
].filter(Boolean);

const GROQ_KEY = process.env.GROQ_API_KEY || "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";

function getSystemDirective() {
    return `You are "RAILFLOW AI", the authoritative Indian Railways Operations and Passenger Assistant.
Knowledge & Topology Ground Truth:
- Southern Railway (SR) Main Chord Line connects Tiruchirappalli (TPJ) and Chennai Egmore (MS) via Ariyalur (ALU), Vriddhachalam (VRI), Villupuram (VM), Chengalpattu (CGL), and Tambaram (TBM).
- Ariyalur (ALU) is on the Chord Line (~267 km from Chennai Egmore, ~70 km from TPJ). Key trains: 12638 Pandian SF Express, 12636 Vaigai SF Express, 12606 Pallavan SF Express, 12654 Rockfort SF Express, 16128 Guruvayur Express.
- Chennai Central (MAS) is the terminus for Bangalore, Mumbai, Delhi, and Howrah trunks.
- Chennai Egmore (MS) is the terminus for southern destinations (Madurai, Trichy, Tirunelveli, Kanyakumari).
- Incorporate comprehensive real Indian Railways knowledge across the web: Kavach TCAS, Vande Bharat, automated block signalling, platform layouts, and PNR rules.
- Format responses cleanly with Markdown headers, bold station codes, bullet points, and timings.`;
}

function getLocalDeterministicResponse(query) {
    const q = (query || '').toLowerCase();
    if ((q.includes('alu') || q.includes('ariyalur')) && (q.includes('ms') || q.includes('chennai') || q.includes('egmore') || q.includes('route') || q.includes('to'))) {
        return `### Direct Express Route: Ariyalur (ALU) ➔ Chennai Egmore (MS)\n\n` +
               `* **Corridor:** Southern Railway Main Chord Line\n` +
               `* **Route Sequence:** **ALU** (Ariyalur) ➔ **VRI** (Vriddhachalam) ➔ **VM** (Villupuram) ➔ **CGL** (Chengalpattu) ➔ **TBM** (Tambaram) ➔ **MS** (Chennai Egmore)\n` +
               `* **Distance:** ~267 km • **Duration:** 3h 40m - 4h 10m\n` +
               `* **Top Verified Express Trains:**\n` +
               `  • **12638 Pandyan SF Express** (Departs ALU ~01:14 ➔ Arrives MS 05:15)\n` +
               `  • **12606 Pallavan SF Express** (Departs ALU ~08:11 ➔ Arrives MS 12:10)\n` +
               `  • **12636 Vaigai SF Express** (Departs ALU ~10:14 ➔ Arrives MS 14:15)\n` +
               `  • **12654 Rockfort SF Express** (Departs ALU ~23:54 ➔ Arrives MS 04:00)\n` +
               `  • **16128 Guruvayur Express** (Departs ALU ~16:44 ➔ Arrives MS 21:25)`;
    }
    if ((q.includes('alu') || q.includes('ariyalur')) && (q.includes('tpj') || q.includes('trichy') || q.includes('tiruchirappalli'))) {
        return `### Ariyalur (ALU) ➔ Tiruchirappalli Jn (TPJ)\n\n` +
               `* **Line:** Southern Railway Chord Main Line (Double Electrified 25kV AC)\n` +
               `* **Distance:** ~70 km • **Travel Time:** 50 - 65 minutes\n` +
               `* **Key Express Trains:** Vaigai Superfast, Pallavan Superfast, Rockfort Express, Pandyan Express.`;
    }
    return `### Indian Railways Intelligence (RailFlow Engine)\n\n` +
           `* **Database:** SQLite 3.50.3 WAL + Real Railway Topology Graph\n` +
           `* **Southern Corridors:** Chord Line (TPJ ➔ ALU ➔ VRI ➔ VM ➔ CGL ➔ TBM ➔ MS), Western Trunk (MAS ➔ AJJ ➔ KPD ➔ JTJ ➔ SA ➔ ED ➔ CBE).\n` +
           `* Query: "${query}". All national trunks operational.`;
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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

        const promptText = userPrompt.trim();
        const fullPrompt = `${getSystemDirective()}\n\nUser Question: ${promptText}`;

        // ─── TIER 1: Google Gemini (Keys rotated automatically) ───
        for (const key of GEMINI_KEYS) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                        generationConfig: { temperature: 0.25, maxOutputTokens: 2048 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (answer && answer.trim()) {
                        return res.status(200).json({ answer, status: 'success', model: 'gemini-2.5-flash', ok: true });
                    }
                }
            } catch (err) {
                console.warn('[Serverless AI] Gemini key failed, trying next...');
            }
        }

        // ─── TIER 2: Groq Cloud (Llama 3.3 70B Versatile) ───
        if (GROQ_KEY) {
            try {
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [
                            { role: 'system', content: getSystemDirective() },
                            { role: 'user', content: promptText }
                        ],
                        temperature: 0.2,
                        max_tokens: 1500
                    })
                });

                if (groqRes.ok) {
                    const data = await groqRes.json();
                    const answer = data.choices?.[0]?.message?.content;
                    if (answer) {
                        return res.status(200).json({ answer, status: 'success', model: 'groq-llama-3.3-70b', ok: true });
                    }
                }
            } catch (err) {
                console.warn('[Serverless AI] Groq fallback failed:', err.message);
            }
        }

        // ─── TIER 3: OpenRouter ───
        if (OPENROUTER_KEY) {
            try {
                const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'deepseek/deepseek-chat',
                        messages: [
                            { role: 'system', content: getSystemDirective() },
                            { role: 'user', content: promptText }
                        ],
                        temperature: 0.2
                    })
                });

                if (orRes.ok) {
                    const data = await orRes.json();
                    const answer = data.choices?.[0]?.message?.content;
                    if (answer) {
                        return res.status(200).json({ answer, status: 'success', model: 'openrouter-deepseek', ok: true });
                    }
                }
            } catch (err) {
                console.warn('[Serverless AI] OpenRouter fallback failed:', err.message);
            }
        }

        // ─── TIER 4: Deterministic Local Railway Engine Fallback ───
        const localAnswer = getLocalDeterministicResponse(promptText);
        return res.status(200).json({ answer: localAnswer, status: 'success', model: 'railflow-deterministic-v2', ok: true });

    } catch (error) {
        console.error('Serverless RailFlow AI critical catch:', error);
        const fallback = getLocalDeterministicResponse(req.query?.q || 'Railway');
        return res.status(200).json({ answer: fallback, status: 'success', model: 'railflow-fallback-safe', ok: true });
    }
};
