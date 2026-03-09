const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');

const fixFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove `min-h-screen`, `h-full`, `overflow-x-hidden`, `overflow-y-auto` from the top level div of full-page wrappers
    // Common pattern: className="... h-full min-h-screen w-full flex-col overflow-x-hidden ..."
    content = content.replace(/className="([^"]*)h-full\s+min-h-screen([^"]*)overflow-x-hidden([^"]*)"/g, 'className="$1w-full flex-col$3"');
    content = content.replace(/className="([^"]*)h-full\s+min-h-screen([^"]*)"/g, 'className="$1w-full flex-col$2"');

    // Replace overflow-y-auto on inner main or div
    content = content.replace(/<main className="([^"]*)flex-1 overflow-y-auto([^"]*)"/g, '<main className="$1flex-1$2"');
    content = content.replace(/<div className="([^"]*)flex-1 overflow-y-auto([^"]*)"/g, '<div className="$1flex-1$2"');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${path.basename(filePath)}`);
    }
};

const walk = (d) => {
    const list = fs.readdirSync(d);
    list.forEach(file => {
        const filePath = path.join(d, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            fixFile(filePath);
        }
    });
};

walk(dir);
console.log("Done.");
