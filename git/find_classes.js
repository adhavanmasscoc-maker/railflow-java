const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let classes = new Set();
let match;
const regex = /class="([^"]+)"/g;
while ((match = regex.exec(html)) !== null) {
  match[1].split(' ').forEach(c => classes.add(c));
}
console.log(Array.from(classes).filter(c => c.includes('drawer') || c.includes('modal') || c.includes('backdrop')).join(', '));
