import fs from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('./src/components');

async function fix() {
    const dirFiles = await fs.readdir(DIR);
    let patchedFiles = 0;

    for (const file of dirFiles) {
        if (file.endsWith('.tsx')) {
            const p = path.join(DIR, file);
            let content = await fs.readFile(p, 'utf8');

            // Replace generic 'fixed' elements with explicit constraints so they map to the layout.tsx max-w-md
            content = content.replace(/className="((?:[^"]* )?fixed [^"]*)"/g, (match, classes) => {
                // If it doesn't already have max-w-md, add it
                if (!classes.includes('max-w-md')) {
                    return `className="${classes.trim()} max-w-md mx-auto"`;
                }
                return match;
            });

            // Same constraint for 'w-full' wrappers and fixed headers
            // Also to sticky tops which might try to span 'w-full' but don't need 'mx-auto' since parents handle it,
            // but if we are trying to force mobile layout, sticky is relative to the wrapper so it is okay.

            await fs.writeFile(p, content);
            patchedFiles++;
        }
    }

    console.log(`Patched ${patchedFiles} component files to enforce max-w-md responsive wrapper`);
}
fix();
