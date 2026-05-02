import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const linksPath = path.join(process.cwd(), 'mogpog_business_links.json');
const resultsPath = path.join(process.cwd(), 'mogpog_pilot_results.json');

if (!fs.existsSync(linksPath)) {
    console.error("mogpog_business_links.json not found.");
    process.exit(1);
}

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
const existingResults = fs.existsSync(resultsPath) ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')) : [];
const existingUrls = new Set(existingResults.map(r => r.url));

console.log(`Starting batch scrape. Total links: ${links.length}. Existing: ${existingUrls.size}`);

const results = [...existingResults];

for (let i = 0; i < links.length; i++) {
    const url = links[i];
    if (existingUrls.has(url)) {
        console.log(`[${i+1}/${links.length}] Skipping existing: ${url}`);
        continue;
    }

    console.log(`\n[${i+1}/${links.length}] Scraping: ${url}`);
    try {
        // Run scraper and capture the output to find the filename
        const output = execSync(`node next-app/scripts/pilot-scraper.mjs "${url}"`, { encoding: 'utf8' });
        
        // Find the filename in the output
        const match = output.match(/✅ Saved to (scrape_result_\d+\.json)/);
        if (match) {
            const filename = match[1];
            const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
            results.push(data);
            fs.unlinkSync(filename);
            
            // Save intermediate results to avoid data loss
            fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
        }
    } catch (e) {
        console.error(`Failed to scrape ${url}: ${e.message}`);
    }
}

console.log(`\n✅ Batch scrape complete. Total results saved: ${results.length}`);
