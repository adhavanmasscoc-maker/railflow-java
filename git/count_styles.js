const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let htmlStyles = html.match(/style="[^"]*"/g) || [];
console.log(`index.html inline styles: ${htmlStyles.length}`);
let js = fs.readFileSync('js/app.js', 'utf8');
let jsStyles = js.match(/style="[^"]*"/g) || [];
let jsStyles2 = js.match(/style='[^']*'/g) || [];
console.log(`js/app.js inline styles: ${jsStyles.length + jsStyles2.length}`);
