const fs = require('fs');
const path = require('path');

const mappings = {
    '/create-event-post-screen': '/events/create',
    '/create-new-job-post-screen': '/jobs/create',
    '/create-new-listing': '/marketplace/create',
    '/admin-create-blog-post': '/admin/create-blog',
    '/post-commute-or-delivery-listing': '/commute/create',
    '/share-alocal-gem-screen': '/gems/create'
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
                const r1 = new RegExp(`href=["']${oldPath}["']`, 'g');
                if (r1.test(content)) {
                    content = content.replace(r1, `href="${newPath}"`);
                    modified = true;
                }
                const r2 = new RegExp(`href={\\`${ oldPath }\\`}`, 'g');
                if (r2.test(content)) {
                    content = content.replace(r2, `href={\`${newPath}\`}`);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed URLs in ' + fullPath);
            }
        }
    }
}
dirsToMigrate.forEach(processDirectory);
console.log('Done rewiring part 2.');
