const fs = require('fs');
const path = require('path');
const componentsDir = 'C:/Users/mspen/OneDrive/Desktop/stitch/next-app/src/components';
const appDir = 'C:/Users/mspen/OneDrive/Desktop/stitch/next-app/src/app';

const regex = /href=[\"'](\/[a-zA-Z0-9\-\/]+)[\"']/g;

const routes = [];
function checkFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        let routePattern = match[1];
        if (routePattern === '/' || routePattern.startsWith('/api/') || routePattern.startsWith('/auth/')) continue;
        routes.push({ file: path.basename(file), route: routePattern });
    }
}

function traverse(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            checkFile(fullPath);
        }
    });
}
traverse(componentsDir);
traverse(appDir);

const uniqueRoutes = [...new Set(routes.map(r => r.route))];
console.log('Unique linked routes throughout codebase:');
console.log(uniqueRoutes.join('\n'));
