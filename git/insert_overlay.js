const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<aside class="rf-sidebar sidebar" id="sidebar">', '<div class="sidebar-overlay" id="sidebarOverlay" onclick="document.getElementById(\'sidebar\').classList.remove(\'mobile-open\'); this.classList.remove(\'active\');"></div>\n <aside class="rf-sidebar sidebar" id="sidebar">');
fs.writeFileSync('index.html', html);
console.log('Done overlay replacement.');
