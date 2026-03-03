import fs from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('./src/components');

async function fix() {
    const dirFiles = await fs.readdir(DIR);
    for (const file of dirFiles) {
        if (file.endsWith('.tsx')) {
            const p = path.join(DIR, file);
            let content = await fs.readFile(p, 'utf8');

            content = content.replace(/ value(?=[\s>])/g, ' value=""');
            content = content.replace(/ defaultValue(?=[\s>])/g, ' defaultValue=""');
            content = content.replace(/ defaultValue\/\>/g, ' defaultValue="" />');

            // Fix numeric placeholders: placeholder={0} -> placeholder="0"
            content = content.replace(/placeholder=\{([0-9\.]+)\}/g, 'placeholder="$1"');

            await fs.writeFile(p, content);
        }
    }
}
fix();
