import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let patchedCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Match any nav/div block that has 'fixed bottom-0' and remove it entirely.
    // This regex matches a self-contained JSX element starting with <nav or <div
    // containing 'fixed bottom-0', up to and including its closing tag.
    // We handle both <nav ...> and <div ...> cases.

    // Strategy: find the start of any element with 'fixed bottom-0', then walk
    // forward to find the matching closing tag.

    const lines = content.split('\n');
    const outputLines = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Detect the start of a bottom nav element
        if (line.match(/<(nav|div)[^>]*fixed bottom-0/)) {
            // Determine the tag name
            const tagMatch = line.match(/<(nav|div)/);
            const tag = tagMatch ? tagMatch[1] : 'nav';

            // Count open/close to find end
            let depth = 0;
            let j = i;

            while (j < lines.length) {
                const l = lines[j];
                const opens = (l.match(new RegExp(`<${tag}`, 'g')) || []).length;
                const closes = (l.match(new RegExp(`</${tag}>`, 'g')) || []).length;
                depth += opens - closes;
                j++;
                if (depth <= 0) break;
            }

            // Skip all lines from i to j (exclusive)
            i = j;
            console.log(`  Removed bottom nav block from ${file} (lines ${i}-${j})`);
        } else {
            outputLines.push(line);
            i++;
        }
    }

    const newContent = outputLines.join('\n');
    if (newContent !== original) {
        fs.writeFileSync(filePath, newContent);
        patchedCount++;
        console.log(`✓ Patched: ${file}`);
    }
}

console.log(`\nRemoved inline bottom navs from ${patchedCount} components.`);
