/**
 * Vercel Serverless Function: India Rail Info Atlas Proxy & Bridge
 * Provides secure retrieval and seamless fallback for Indian Railways Live Atlas
 */

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

    try {
        // Step 1: Initial fetch
        const atlasRes = await fetch('https://indiarailinfo.com/atlas', {
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        let html = await atlasRes.text();

        // Check if India Rail Info served the browser verification challenge
        if (html.includes('iri-xsig') || html.includes('Browser verification failed')) {
            try {
                // Attempt challenge solver
                const sigMatch = html.match(/id="iri-xsig"\s+data-sig="([^"]+)"/);
                if (sigMatch) {
                    const xsig = sigMatch[1];
                    const parts = xsig.split('|');
                    const x = parts[2] || 84;
                    const token = [0, 5, 1, 1, 8, 1, 1, 0, x, xsig, 0].join(':');

                    let cookies = [];
                    if (atlasRes.headers.getSetCookie) {
                        cookies = atlasRes.headers.getSetCookie().map(c => c.split(';')[0]);
                    } else if (atlasRes.headers.get('set-cookie')) {
                        cookies = [atlasRes.headers.get('set-cookie').split(';')[0]];
                    }

                    const verifyRes = await fetch(`https://indiarailinfo.com/verify-browser?t=${encodeURIComponent(token)}`, {
                        headers: {
                            'User-Agent': userAgent,
                            'Referer': 'https://indiarailinfo.com/atlas',
                            'Cookie': cookies.join('; '),
                            'Accept': '*/*'
                        }
                    });

                    if (verifyRes.headers.getSetCookie) {
                        const newCookies = verifyRes.headers.getSetCookie().map(c => c.split(';')[0]);
                        cookies = [...cookies, ...newCookies];
                    }

                    const verifiedRes = await fetch('https://indiarailinfo.com/atlas', {
                        headers: {
                            'User-Agent': userAgent,
                            'Referer': 'https://indiarailinfo.com/',
                            'Cookie': cookies.join('; '),
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                        }
                    });

                    const verifiedHtml = await verifiedRes.text();
                    if (!verifiedHtml.includes('iri-xsig') && !verifiedHtml.includes('Browser verification failed')) {
                        html = verifiedHtml;
                        if (!html.includes('<base')) {
                            html = html.replace('<head>', '<head><base href="https://indiarailinfo.com/">');
                        }
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        return res.status(200).send(html);
                    }
                }
            } catch (solveErr) {
                // Fallback to cyber bridge below
            }

            // If challenge still triggers, render a cyber bridge screen with direct launcher
            const bridgeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>India Rail Info Live Atlas Bridge</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
        body { background:#070B12; color:#E2E8F0; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; padding:1.5rem; }
        .card { background:rgba(15,23,42,0.85); border:1px solid #1E293B; border-radius:12px; padding:2rem; max-width:520px; box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(8px); }
        .badge { display:inline-block; padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700; background:rgba(239,68,68,0.15); color:#F87171; border:1px solid rgba(239,68,68,0.3); margin-bottom:1rem; }
        h2 { font-size:1.3rem; margin-bottom:0.75rem; color:#F1F5F9; font-weight:700; letter-spacing:0.02em; }
        p { font-size:0.88rem; color:#94A3B8; line-height:1.6; margin-bottom:1.5rem; }
        .actions { display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; }
        .btn { display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:8px; font-size:0.85rem; font-weight:600; text-decoration:none; cursor:pointer; transition:all 0.2s ease; border:none; }
        .btn-primary { background:linear-gradient(135deg, #EF4444, #B91C1C); color:#fff; box-shadow:0 4px 12px rgba(239,68,68,0.3); }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(239,68,68,0.4); }
        .btn-secondary { background:#1E293B; color:#CBD5E1; border:1px solid #334155; }
        .btn-secondary:hover { background:#334155; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">🌐 SESSION AUTHENTICATION REQUIRED</span>
        <h2>India Rail Info — Live Atlas</h2>
        <p>
            India Rail Info protects its live atlas using strict first-party browser session cookies that modern browsers restrict inside embedded iframes.
        </p>
        <div class="actions">
            <a href="https://indiarailinfo.com/atlas" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <span>Open Live Atlas in Dedicated Window ↗</span>
            </a>
            <button class="btn btn-secondary" onclick="if(window.parent && window.parent.setDashboardMapMode) window.parent.setDashboardMapMode('openrailway');">
                <span>View OpenRailwayMap IR Live Layer</span>
            </button>
        </div>
    </div>
</body>
</html>`;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(bridgeHtml);
        }

        if (!html.includes('<base')) {
            html = html.replace('<head>', '<head><base href="https://indiarailinfo.com/">');
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
    } catch (err) {
        res.status(502).json({ error: `Failed to fetch India Rail Info Atlas: ${err.message}` });
    }
};
