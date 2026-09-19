const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');
html = html.replace(/rounded-full/g, 'rounded-md');
html = html.replace(/badge-pill/g, 'badge');
if(!html.includes('rf-footer-ticker')) {
    html = html.replace('</div>\r\n</body>', '<!-- ─── Global Footer Telemetry Ticker ────────────────────────── -->\n    <footer class="rf-footer-ticker" id="globalFooterTicker">\n        <div>SYSTEM STATUS: <strong style="color:var(--emerald);">NOMINAL</strong></div>\n        <div>LATENCY: 12ms</div>\n    </footer>\n</div>\r\n</body>');
    html = html.replace('</div>\n</body>', '<!-- ─── Global Footer Telemetry Ticker ────────────────────────── -->\n    <footer class="rf-footer-ticker" id="globalFooterTicker">\n        <div>SYSTEM STATUS: <strong style="color:var(--emerald);">NOMINAL</strong></div>\n        <div>LATENCY: 12ms</div>\n    </footer>\n</div>\n</body>');
}
fs.writeFileSync('frontend/index.html', html);
console.log('HTML updated');
