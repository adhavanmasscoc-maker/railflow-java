/**
 * RailFlow AI Engine - Autonomous Railway Intelligence Copilot
 * Grounded in authentic Indian Railways operations, crowd dispatch telemetry, and network topology.
 * Powered by Google Gemini 2.5 Flash with resilient multi-tier fallback (OpenRouter, Groq, and local intelligence).
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
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
    } catch (e) {
        console.warn('[RailFlow AI] Could not parse .env file:', e.message);
    }
}

loadEnv();

function getGeminiKeys() {
    loadEnv();
    return [
        process.env.GEMINI_API_KEY,
        process.env.GOOGLE_API_KEY
    ].filter(Boolean);
}

function getSystemDirective() {
    return `You are "RAILFLOW AI", the authoritative Indian Railways Operations Copilot, Network Dispatcher, and Crowd Intelligence Engine.
Role: Autonomous Railway Intelligence, Central Operations Control (COC) Copilot, and Commuter Guide.
Persona: Highly knowledgeable, operationally precise, and professional.

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
   - Automatic Block Signalling (ABS), Electronic Interlocking (EI), axle counters, 25 kV AC traction.

4. Commuter & IRCTC Guidance:
   - Live running status, PNR confirmation probabilities, Tatkal timings, platform amenities.

RESPONSE STYLE:
- Professional, concise, high-tech Markdown with bullet points, train numbers, timings, and actionable dispatch intel.
- When greeted (e.g. "hi", "hello"), introduce yourself as RailFlow AI, report nominal network status, and offer assistance on crowd dispatch, route planning, platform telemetry, or train scheduling.`;
}

/**
 * Ask RailFlow AI using Multi-tier Resilient Architecture:
 * 1. Google Gemini Direct (gemini-flash-latest, gemini-flash-lite-latest, gemini-2.5-flash-lite)
 * 2. OpenRouter (google/gemini-2.5-flash)
 * 3. Groq (qwen/qwen3.8-27b)
 * 4. High-fidelity conversational local railway intelligence
 */
async function askRailFlowAI(userQuery) {
    if (!userQuery || !userQuery.trim()) {
        return "Please enter a valid question about Indian Railways, station operations, crowd dispatch, or routes.";
    }

    const query = userQuery.trim();
    const systemPrompt = getSystemDirective();
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
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
                        }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1024
                        }
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (answer && answer.trim()) {
                        return answer;
                    }
                }
            } catch (err) {
                // Continue to next model or tier
            }
        }
    }

    // ─── TIER 2: OpenRouter Google Gemini 2.5 Flash ───
    if (openRouterKey) {
        const orModels = ['google/gemini-2.5-flash', 'google/gemini-flash-1.5'];
        for (const model of orModels) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openRouterKey}`,
                        'HTTP-Referer': 'https://aknex-railflow.vercel.app',
                        'X-Title': 'RailFlow AI'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: query }
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
                    if (answer && answer.trim()) return answer;
                }
            } catch (err) {
                // Continue to Groq
            }
        }
    }

    // ─── TIER 3: Groq Cloud ───
    if (groqKey) {
        const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
        for (const model of groqModels) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: query }
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
                    if (answer && answer.trim()) return answer;
                }
            } catch (err) {
                // Continue to Tier 4
            }
        }
    }

    // ─── TIER 4: Local High-Fidelity Conversational Intelligence (Fail-Safe) ───
    return fallbackLocalAI(query);
}

function fallbackLocalAI(query) {
    const q = query.toLowerCase().trim();

    // Greeting handling
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ')) {
        return `**RAILFLOW AI // System Initialized**\n\n` +
               `Greetings, Operations Controller! I am **RailFlow AI**, your autonomous Indian Railways Operations Copilot, Network Dispatcher, and Crowd Intelligence Engine.\n\n` +
               `### Current System Diagnostics\n` +
               `* **Active Network Hubs:** Chennai Central (MAS), Chennai Egmore (MS), Tiruchirappalli (TPJ), Ariyalur (ALU), Madurai (MDU), Coimbatore (CBE).\n` +
               `* **Telemetry Status:** Turnstiles, FOB density meters, and block signalling reporting nominal.\n` +
               `* **Southern Main Chord Corridor:** Double electrified broad gauge with Automatic Block Signalling active.\n\n` +
               `### How Can I Assist You Today?\n` +
               `1. **Crowd Dispatch & Telemetry:** Influx rates, platform density management, and relief rake dispatch.\n` +
               `2. **Corridor Routing:** Verified stop sequences, timings, and express train schedules (e.g. ALU ➔ MS).\n` +
               `3. **Signalling & Safety:** Kavach (TCAS) compliance, braking curves, and headway management.\n\n` +
               `*Type your operational query or station pair to begin.*`;
    }

    // Crowd dispatch queries
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

    // Ariyalur to Chennai Egmore
    if (q.includes('alu') && (q.includes('ms') || q.includes('chennai') || q.includes('egmore') || q.includes('route') || q.includes('to'))) {
        return `### Ariyalur (ALU) to Chennai Egmore (MS) Corridor\n\n` +
               `* **Corridor Line:** Southern Railway Main Chord Line\n` +
               `* **Route Sequence:** **ALU** (Ariyalur) ➔ **VRI** (Vriddhachalam) ➔ **VM** (Villupuram) ➔ **CGL** (Chengalpattu) ➔ **TBM** (Tambaram) ➔ **MS** (Chennai Egmore)\n` +
               `* **Track Distance:** ~267 km • **Travel Time:** 3h 40m - 4h 10m\n` +
               `* **Key Express Trains:**\n` +
               `  1. **12638 Pandyan Express** (Departs ALU ~01:14 ➔ Arrives MS 05:15)\n` +
               `  2. **12606 Pallavan Superfast** (Departs ALU ~08:11 ➔ Arrives MS 12:10)\n` +
               `  3. **12636 Vaigai Superfast** (Departs ALU ~10:14 ➔ Arrives MS 14:15)\n` +
               `  4. **16128 Guruvayur Express** (Departs ALU ~16:44 ➔ Arrives MS 21:25)\n` +
               `  5. **12654 Rockfort Superfast** (Departs ALU ~23:54 ➔ Arrives MS 04:00)\n` +
               `* **Operational Status:** Double Electrified Broad Gauge (25kV AC) with Automatic Block Signalling.`;
    }

    // Ariyalur to Trichy
    if (q.includes('alu') && (q.includes('tpj') || q.includes('trichy') || q.includes('tiruchirappalli'))) {
        return `### Ariyalur (ALU) to Tiruchirappalli Jn (TPJ)\n\n` +
               `* **Route:** Direct Southern Railway Chord Line section (ALU ➔ Kallakkudi Kovandakurichi ➔ Lalgudi ➔ Golden Rock ➔ TPJ)\n` +
               `* **Distance:** ~70 km • **Travel Time:** 50 mins to 1 hr 10 mins\n` +
               `* **Key Trains:** Vaigai Superfast, Pallavan Express, Rockfort Express, Pandyan Express.`;
    }

    // Kavach
    if (q.includes('kavach') || q.includes('tcas') || q.includes('signall')) {
        return `### Kavach (Indian Railways TCAS)\n\n` +
               `* **Technology:** Indigenous Automatic Train Protection (ATP) system developed by RDSO.\n` +
               `* **Key Features:** Automated brake application on Signal Passed at Danger (SPAD), continuous cab-signalling, anti-collision RF communication between locomotives, and auto-whistling at level crossing gates.\n` +
               `* **Deployment:** High-density Golden Quadrilateral / Diagonal routes (Delhi-Mumbai, Delhi-Howrah, and expanding across Southern Railway).`;
    }

    return `### RailFlow Operations AI Assistant\n\n` +
           `Query: *${query}*\n\n` +
           `* **Zonal Network Active:** Southern Railway (SR), Northern Railway (NR), Western Railway (WR), Central Railway (CR).\n` +
           `* **Southern Corridors:** Main Chord line (MS-TBM-CGL-VM-VRI-ALU-TPJ) and Western line (MAS-AJJ-JTJ-SA-ED-CBE) reporting nominal status.\n` +
           `* **Real-time Telemetry:** Turnstiles, block signaling, and crowd telemetry running continuous 3,000 ms telemetry cycle.\n\n` +
           `Please specify a train number, station code, or corridor for detailed dispatch telemetry.`;
}

module.exports = {
    askRailFlowAI,
    buildSystemContext: getSystemDirective,
    getSystemDirective,
    fallbackLocalAI
};
