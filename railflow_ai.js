const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Load environment variables from .env if present
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    const key = trimmed.substring(0, eqIdx).trim();
                    const val = trimmed.substring(eqIdx + 1).trim();
                    if (key && !process.env[key]) process.env[key] = val;
                }
            }
        });
    }
} catch (e) {}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

const app = express();
app.use(express.json());
app.use(cors());

function buildRailFlowAIContext() {
    let contextData = "SYSTEM DIRECTIVE: You are RAILFLOW AI, an expert railway logistics and operations assistant.\n";
    contextData += "You must base your answers on the real data stored in this context block, and use the web to supplement real Indian Railways knowledge.\n\n";
    
    const dataPath = path.join(__dirname, 'js', 'data', 'masterRailwayData.js');
    if (fs.existsSync(dataPath)) {
        contextData += "--- MASTER RAILWAY DATA ---\n";
        contextData += fs.readFileSync(dataPath, 'utf8') + "\n\n";
    }

    const rootDir = __dirname;
    const files = fs.readdirSync(rootDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    contextData += "--- PROJECT DOCUMENTATION (MD FILES) ---\n";
    for (const file of mdFiles) {
        const filePath = path.join(rootDir, file);
        contextData += `\n[FILE: ${file}]\n`;
        contextData += fs.readFileSync(filePath, 'utf8') + "\n";
    }
    return contextData;
}

const systemPrompt = buildRailFlowAIContext();

app.post('/api/ask-railflow-ai', async (req, res) => {
    try {
        const userMessage = req.body.prompt;
        if (!userMessage) return res.status(400).json({ error: "Prompt is required" });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n--- USER QUESTION ---\n" + userMessage }] }],
            generationConfig: { temperature: 0.2 }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: data.error.message || "Gemini API Error" });
        
        res.json({ answer: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.AI_PORT || 3001;
app.listen(PORT, () => {
    console.log(`[RailFlow AI] Endpoint active on port ${PORT}`);
    console.log(`[RailFlow AI] Ready to receive questions at POST /api/ask-railflow-ai`);
});
