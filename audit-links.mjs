import fs from 'node:fs';
import path from 'node:path';
const dir = 'src/components';
const appDir = 'src/app';

// Get all routes from app directory
const routes = [];
function walkApp(d, base) {
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            const routePath = base + '/' + item.name;
            if (!item.name.startsWith('[') && !item.name.startsWith('_')) {
                routes.push(routePath);
            }
            walkApp(path.join(d, item.name), routePath);
        }
    }
}
walkApp(appDir, '');

console.log('=== EXISTING ROUTES ===');
routes.forEach(r => console.log(r));
console.log('');

// Get all hrefs from component files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
const hrefRe = /href=["']([^"']+)["']/g;
const toRe = /\bto=["']([^"']+)["']/g;

console.log('=== HREFS IN COMPONENTS ===');
const allHrefs = new Set();
for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const hrefs = [];
    let m;
    while ((m = hrefRe.exec(content)) !== null) hrefs.push(m[1]);
    while ((m = toRe.exec(content)) !== null) hrefs.push(m[1]);
    if (hrefs.length) {
        console.log('\n' + f + ':');
        hrefs.forEach(h => { console.log('  ' + h); allHrefs.add(h); });
    }
}

console.log('\n=== BROKEN LINKS (href with no matching route) ===');
for (const h of allHrefs) {
    if (h.startsWith('http') || h.startsWith('tel:') || h.startsWith('mailto:') || h.startsWith('#') || h === '/') continue;
    // Strip query strings and hashes
    const cleanH = h.split('?')[0].split('#')[0];
    if (!routes.includes(cleanH)) {
        console.log('MISSING ROUTE: ' + h);
    }
}
