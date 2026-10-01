const fs = require('fs');

function stripStyles(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove style="..."
    content = content.replace(/style="[^"]*"/g, '');
    // Remove style='...'
    content = content.replace(/style='[^']*'/g, '');
    // Clean up multiple spaces that might have been created
    content = content.replace(/ +>/g, '>');
    content = content.replace(/  +/g, ' ');
    fs.writeFileSync(filePath, content);
    console.log(`Stripped styles from ${filePath}`);
}

stripStyles('index.html');
stripStyles('js/app.js');
