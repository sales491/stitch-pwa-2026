import fs from 'node:fs/promises';
import path from 'node:path';
import HTMLtoJSX from 'htmltojsx';

const BASE_DIR = path.resolve('../stitch');
const OUT_DIR = path.resolve('./src/components');

function toPascalCase(str) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase());
}

async function main() {
    const converter = new HTMLtoJSX({ createClass: false });

    try {
        await fs.mkdir(OUT_DIR, { recursive: true });
        const entries = await fs.readdir(BASE_DIR, { withFileTypes: true });

        let processedFiles = 0;

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const folderPath = path.join(BASE_DIR, entry.name);
            const codeHtmlPath = path.join(folderPath, 'code.html');

            try {
                const fileStat = await fs.stat(codeHtmlPath);
                if (fileStat.isFile()) {
                    console.log(`Processing ${entry.name}...`);
                    const htmlContent = await fs.readFile(codeHtmlPath, 'utf8');

                    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    let rawHtml = bodyMatch ? bodyMatch[1] : htmlContent;

                    let jsxContent = converter.convert(rawHtml);
                    jsxContent = jsxContent.replace(/export default function[^{]*{\s*return\s*\(\s*(<[\s\S]*>)\s*\);\s*}\s*$/, '$1');

                    const componentName = toPascalCase(entry.name);

                    const finalComponent = `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;

                    await fs.writeFile(path.join(OUT_DIR, `${componentName}.tsx`), finalComponent);
                    processedFiles++;
                }
            } catch (err) { }
        }
        console.log(`Successfully processed ${processedFiles} files.`);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
