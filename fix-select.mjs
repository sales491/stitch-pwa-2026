import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let count = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Add defaultValue="" to select tags if they don't have one
    content = content.replace(/<select([^>]*?)>/g, (match, attrs) => {
        if (!attrs.includes('defaultValue=')) {
            return `<select defaultValue=""${attrs}>`;
        }
        return match;
    });

    // Remove the `selected` attribute from options
    content = content.replace(/<option\s+([^>]*?)selected([^>]*?)>/g, (match, prefix, suffix) => {
        return `<option ${prefix}${suffix}>`.replace(/\s+/g, ' ');
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        count++;
    }
}

console.log(`Updated select/option elements in ${count} files.`);
