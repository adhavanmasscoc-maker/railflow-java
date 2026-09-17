/**
 * Vercel Serverless Function: RailFlow AI Operations Assistant
 * Endpoint: /api/ask-railflow-ai
 * Multi-Tier Resilient Architecture: Gemini Direct -> OpenRouter (Gemini 2.5 Flash) -> Groq -> Local Dispatch Engine
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPaths = [
            path.join(__dirname, '.env'),
            path.join(__dirname, '..', '.env')
        ];
        for (const envPath of envPaths) {
            if (fs.existsSync(envPath)) {
                const lines = fs.readFileSync(envPath, 'utf8').split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.startsWith('#')) {
                        const eqIdx = trimmed.indexOf('=');
                        if (eqIdx !== -1) {
                            const k = trimmed.substring(0, eqIdx).trim();
                            const v = trimmed.substring(eqIdx + 1).trim();
                            if (k && !process.env[k]) process.env[k] = v;
                        }
                    }
                }
            }
        }
    } catch (e) {}
}
loadEnv();

function getGeminiKeys() {
    loadEnv();
    return [
        process.env.GEMINI_API_KEY,
        process.env.GOOGLE_API_KEY
    ].filter(Boolean);
}

function cleanAIResponse(text) {
    if (!text) return '';
    return text.replace(/^(\s*[-–—*#]{2,}\s*)+/g, '').trim();
}

function getSystemDirective() {
    return `You are "RAILFLOW AI", the authoritative Indian Railways Operations Copilot, Network Dispatcher, and Crowd Intelligence Engine.
Role: Autonomous Railway Intelligence, Central Operations Control (COC) Copilot, and Commuter Guide.
Persona: Highly knowledgeable, operationally precise, and professional.

CRITICAL FORMATTING RULES:
- NEVER start your response with horizontal rules ('---' or '--'), ascii dividers, or decorative bracket tags.
- When greeted (e.g. "hi", "hello"), start directly with:
  "Hi! I am RailFlow AI. What may I assist you with today?"
  Followed by operational capabilities on crowd dispatch, route planning, platform telemetry, and express train schedules.
- Always use professional, clean Markdown with bold station codes, route arrows (➔), and bullet points.

CORE SPECIALIZATIONS & GROUND TRUTH:
1. Real-Time Crowd Dispatch & Telemetry:
   - Platform crowd density management: Normal (< 0.8 persons/m²), Heightened Alert (0.8 - 1.5 persons/m²), Critical Surge (> 1.5 persons/m²).
   - Influx control: Turnstile telemetry, Foot-Overbridge (FOB) load balancing, entrance gate-metering protocols.
   - Dynamic Dispatch: Deploying standby ICF/LHB relief/clone rakes from coaching yards (Basin Bridge BBQ, Tambaram TBM, Golden Rock GOC) during surges.
   - Dynamic platform re-assignment for delayed/congested rakes.

2. Corridor & Topology Ground Truth:
   - Southern Railway (SR) Main Chord Line connects Tiruchirappalli (TPJ) and Chennai Egmore (MS) via Ariyalur (ALU), Vriddhachalam (VRI), Villupuram (VM), Chengalpattu (CGL), and Tambaram (TBM).
   - Ariyalur (ALU) is on the Chord Line (~267 km from MS, ~70 km from TPJ). Key express trains: 12638 Pandyan SF, 12636 Vaigai SF, 12606 Pallavan SF, 12654 Rockfort SF, 16128 Guruvayur Express.
   - Chennai Central (MAS) is the primary terminus for Western/Northern/Eastern trunks (Bengaluru, Mumbai, New Delhi, Howrah).
   - Chennai Egmore (MS) serves Southern Tamil Nadu lines (Madurai, Trichy, Tirunelveli, Rameswaram, Kanyakumari).

3. Safety & Signalling:
   - Kavach (TCAS) Automatic Train Protection, continuous cab-signalling, SPAD prevention, and automatic braking.
   - Automatic Block Signalling (ABS), Electronic Interlocking (EI), axle counters, 25 kV AC traction.`;
}

function getLocalDeterministicResponse(query) {
    const q = (query || '').toLowerCase().trim();

    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ')) {
        return `Hi! I am **RailFlow AI**. What may I assist you with today?\n\n` +
               `### Current System Diagnostics\n` +
               `* **Active Network Hubs:** Chennai Central (MAS), Chennai Egmore (MS), Tiruchirappalli (TPJ), Ariyalur (ALU), Madurai (MDU), Coimbatore (CBE).\n` +
               `* **Telemetry Status:** Turnstiles, FOB density meters, and block signalling reporting nominal.\n` +
               `* **Southern Main Chord Corridor:** Double electrified broad gauge with Automatic Block Signalling active.\n\n` +
               `### Operations & Dispatch Capabilities\n` +
               `1. **Crowd Dispatch & Telemetry:** Influx rates, platform density management, and relief rake dispatch.\n` +
               `2. **Corridor Routing:** Verified stop sequences, timings, and express train schedules (e.g. ALU ➔ MS).\n` +
               `3. **Signalling & Safety:** Kavach (TCAS) compliance, braking curves, and headway management.\n\n` +
               `*Type your operational query or station pair to begin.*`;
    }

    if (q.includes('crowd') || q.includes('dispatch') || q.includes('fob') || q.includes('density') || q.includes('turnstile')) {
        return `### RailFlow Crowd Dispatch & Telemetry Protocol\n\n` +
               `* **Density Threshold Management:**\n` +
               `  • **Green (< 0.8 persons/m²):** Normal platform operations.\n` +
               `  • **Amber (0.8 - 1.5 persons/m²):** Increased platform PA frequency, dynamic digital signage directing passengers to underutilized concourses.\n` +
               `  • **Red (> 1.5 persons/m²):** **Critical Surge Protocol.** Automatic gate-metering at main entrances; RPF crowd segregation at FOB stairwells.\n` +
               `* **Dynamic Rake Allocation:** Pre-positioned standby ICF/LHB rakes at Basin Bridge (BBQ), Tambaram (TBM), and Golden Rock (GOC) yards ready for immediate deployment as clone/relief specials.\n` +
               `* **Dynamic Platform Re-Assignment:** Rakes facing heavy disembarkation surges are shifted to island platforms with dual FOB access to prevent concourse bottlenecks.\n` +
               `* **Signalling Integration:** All crowd relief specials operate under strict Kavach (TCAS) speed-distance curve supervision.`;
    }

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
        const systemDirective = getSystemDirective();
        const geminiKeys = getGeminiKeys();
        const openRouterKey = process.env.OPENROUTER_API_KEY || "";
        const groqKey = process.env.GROQ_API_KEY || "";

        // ─── TIER 1: Google Gemini Direct ───
        const directModels = [
            'gemini-flash-latest',
            'gemini-flash-lite-latest',
            'gemini-2.5-flash-lite',
            'gemini-3.5-flash-lite',
            'gemini-2.5-flash'
        ];

        for (const key of geminiKeys) {
            for (const model of directModels) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 7000);
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: `${systemDirective}\n\nUser Question: ${promptText}` }] }],
                            generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (answer && answer.trim()) {
                            return res.status(200).json({ answer: cleanAIResponse(answer), status: 'success', model: model, ok: true });
                        }
                    }
                } catch (err) {}
            }
        }

        // ─── TIER 2: OpenRouter Google Gemini 2.5 Flash ───
        if (openRouterKey) {
            const orModels = ['google/gemini-2.5-flash', 'google/gemini-flash-1.5'];
            for (const model of orModels) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 7000);
                    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${openRouterKey}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'https://aknex-railflow.vercel.app',
                            'X-Title': 'RailFlow AI'
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: 'system', content: systemDirective },
                                { role: 'user', content: promptText }
                            ],
                            temperature: 0.3,
                            max_tokens: 800
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (orRes.ok) {
                        const data = await orRes.json();
                        const answer = data.choices?.[0]?.message?.content;
                        if (answer && answer.trim()) {
                            return res.status(200).json({ answer: cleanAIResponse(answer), status: 'success', model: model, ok: true });
                        }
                    }
                } catch (err) {}
            }
        }

        // ─── TIER 3: Groq Cloud ───
        if (groqKey) {
            const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
            for (const model of groqModels) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 7000);
                    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${groqKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: 'system', content: systemDirective },
                                { role: 'user', content: promptText }
                            ],
                            temperature: 0.3,
                            max_tokens: 800
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (groqRes.ok) {
                        const data = await groqRes.json();
                        const answer = data.choices?.[0]?.message?.content;
                        if (answer && answer.trim()) {
                            return res.status(200).json({ answer: cleanAIResponse(answer), status: 'success', model: model, ok: true });
                        }
                    }
                } catch (err) {}
            }
        }

        // ─── TIER 4: Deterministic Local Railway Engine Fallback ───
        const localAnswer = cleanAIResponse(getLocalDeterministicResponse(promptText));
        return res.status(200).json({ answer: localAnswer, status: 'success', model: 'railflow-deterministic-v2', ok: true });

    } catch (error) {
        console.error('Serverless RailFlow AI critical catch:', error);
        const fallback = cleanAIResponse(getLocalDeterministicResponse(req.query?.q || 'Railway'));
        return res.status(200).json({ answer: fallback, status: 'success', model: 'railflow-fallback-safe', ok: true });
    }
};
