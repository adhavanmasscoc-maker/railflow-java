const express = require('express');
const cors = require('cors');
const { askRailFlowAI } = require('./railflow_ai_engine');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/ask-railflow-ai', async (req, res) => {
    try {
        const userMessage = req.body.prompt || req.body.query || req.body.message;
        if (!userMessage) return res.status(400).json({ error: "Prompt is required" });

        const answer = await askRailFlowAI(userMessage);
        res.json({ answer, status: "success", model: "gemini-2.5-flash" });
    } catch (error) {
        console.error('RailFlow AI express error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.get('/api/ask-railflow-ai', async (req, res) => {
    try {
        const userMessage = req.query.prompt || req.query.q;
        if (!userMessage) return res.status(400).json({ error: "Prompt is required" });

        const answer = await askRailFlowAI(userMessage);
        res.json({ answer, status: "success", model: "gemini-2.5-flash" });
    } catch (error) {
        console.error('RailFlow AI express error:', error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

const PORT = process.env.AI_PORT || 3001;
app.listen(PORT, () => {
    console.log(`[RailFlow AI] Standalone service active on port ${PORT}`);
    console.log(`[RailFlow AI] Endpoint: http://localhost:${PORT}/api/ask-railflow-ai`);
});
