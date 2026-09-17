const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    req.on('error', (err) => {
        console.error('Request error:', err);
    });

    res.on('error', (err) => {
        console.error('Response error:', err);
    });

    try {
        const host = req.headers.host || `localhost:${DEFAULT_PORT}`;
        const parsedUrl = new URL(req.url, `http://${host}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        if (pathname === '/' || pathname === '') {
            pathname = '/index.html';
        }

        const safePath = path.normalize(path.join(ROOT_DIR, pathname));
        if (!safePath.startsWith(ROOT_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden');
            return;
        }

        fs.stat(safePath, (err, stats) => {
            if (err) {
                const fallbackFrontendPath = path.normalize(path.join(ROOT_DIR, 'frontend', pathname));
                if (fs.existsSync(fallbackFrontendPath)) {
                    return serveFile(fallbackFrontendPath, res);
                }

                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h2>404 Not Found</h2><p>Cannot find ${pathname}</p><p><a href="/">Go to Home</a></p>`);
                return;
            }

            if (stats.isDirectory()) {
                const indexPath = path.join(safePath, 'index.html');
                if (fs.existsSync(indexPath)) {
                    serveFile(indexPath, res);
                } else {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('403 Forbidden: Directory Listing Denied');
                }
                return;
            }

            serveFile(safePath, res);
        });
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Internal Error: ${e.message}`);
    }
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const stream = fs.createReadStream(filePath);
    stream.on('open', () => {
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        stream.pipe(res);
    });
    stream.on('error', (err) => {
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`500 File Read Error: ${err.message}`);
        }
    });
}

function startServer(port) {
    server.listen(port, () => {
        console.log('\n======================================================');
        console.log(` 🚆 RailFlow Server is LIVE at:`);
        console.log(` 👉 http://localhost:${port}/`);
        console.log(` 👉 http://127.0.0.1:${port}/`);
        console.log('======================================================\n');
        console.log(' ✨ Serving static files from:', ROOT_DIR);
        console.log(' ⚡ Zero dependencies - Native Node.js HTTP server');
        console.log(' Press Ctrl+C to stop.\n');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`[!] Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

startServer(DEFAULT_PORT);
