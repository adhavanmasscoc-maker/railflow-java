const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<aside class="ai-drawer" id="aiDrawer">', '<aside class="ai-drawer" id="aiDrawer" style="z-index: 10005;">');
fs.writeFileSync('index.html', html);
console.log('done');
