/**
 * Vercel Serverless Function: India Rail Info Atlas Proxy
 * Fetches https://indiarailinfo.com/atlas with desktop browser headers and serves the real HTML
 */

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const atlasRes = await fetch('https://indiarailinfo.com/atlas', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        const html = await atlasRes.text();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
    } catch (err) {
        res.status(502).json({ error: `Failed to fetch India Rail Info Atlas: ${err.message}` });
    }
};
