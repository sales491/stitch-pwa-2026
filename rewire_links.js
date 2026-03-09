const fs = require('fs');
const path = require('path');

const mappings = {
    '/marinduque-connect-home-feed': '/',
    '/marinduque-classifieds-marketplace': '/marketplace',
    '/marinduque-jobs-listing-feed': '/jobs',
    '/marinduque-events-calendar': '/events',
    '/marinduque-monthly-calendar': '/events',
    '/user-profile-dashboard1': '/profile',
    '/user-profile-dashboard2': '/profile',
    '/commuter-delivery-hub': '/commute',
    '/community-board-commuter-hub': '/commute',
    '/roro-port-information-hub': '/ports',
    '/gems-of-marinduque-feed': '/gems',
    '/classifieds-category-view': '/marketplace',
    '/the-hidden-foreigner-blog-feed': '/blog'
};

const dirsToMigrate = ['src/components', 'src/app'];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const [oldPath, newPath] of Object.entries(mappings)) {
                // strict match within quotes so we don't accidentally replace within longer strings if not exact
                const regexes = [
                    new RegExp(`href=["']${oldPath}["']`, 'g'),
                    new RegExp(`href=\\{\`\s*${oldPath}\s*\`\\}`, 'g'),
                    new RegExp(`router\\.push\\(['"]${oldPath}['"]\\)`, 'g')
                ];

                for (let r of regexes) {
                    if (content.match(r)) {
                        content = content.replace(r, (match) => {
                            if (match.startsWith('href="') || match.startsWith("href='")) return `href="${newPath}"`;
                            if (match.startsWith('href={`')) return `href={\`${newPath}\`}`;
                            if (match.startsWith('router.push')) return `router.push("${newPath}")`;
                            return match;
                        });
                        modified = true;
                    }
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated links in ${fullPath}`);
            }
        }
    }
}

dirsToMigrate.forEach(processDirectory);
console.log('Done rewiring.');
