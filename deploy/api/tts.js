// Vercel Serverless Function: High-Fidelity Multi-Lingual Speech Synthesizer
// Provides crystal-clear native Tamil, Hindi, English, and regional Indian Railway PA announcements
// Streams direct audio/mpeg without requiring client-side native Indic TTS installation

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const text = (url.searchParams.get('q') || url.searchParams.get('text') || '').trim();
    let lang = (url.searchParams.get('tl') || url.searchParams.get('lang') || 'ta').trim().toLowerCase();

    if (!text) {
      return res.status(400).json({ error: 'Missing text or q query parameter' });
    }

    // Map common lang codes to Google TTS language identifiers
    const langMap = {
      'ta-in': 'ta',
      'ta': 'ta',
      'hi-in': 'hi',
      'hi': 'hi',
      'en-in': 'en-IN',
      'en': 'en',
      'te-in': 'te',
      'te': 'te',
      'kn-in': 'kn',
      'kn': 'kn',
      'ml-in': 'ml',
      'ml': 'ml',
      'bn-in': 'bn',
      'bn': 'bn',
      'mr-in': 'mr',
      'mr': 'mr',
      'gu-in': 'gu',
      'gu': 'gu'
    };

    const targetLang = langMap[lang] || lang.slice(0, 2);

    // Limit chunk to 200 chars for reliable Google TTS streaming
    const encodedQuery = encodeURIComponent(text.slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedQuery}`;

    const upstream = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream TTS error: ${upstream.status}` });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('[API /api/tts Error]:', err.message);
    return res.status(500).json({ error: 'Internal TTS error', details: err.message });
  }
};
