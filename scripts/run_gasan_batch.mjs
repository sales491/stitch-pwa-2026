import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const linksPath = path.join(process.cwd(), 'gasan_links.txt');
if (!fs.existsSync(linksPath)) {
    console.error("gasan_links.txt not found.");
    process.exit(1);
}

const links = fs.readFileSync(linksPath, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && l.startsWith('http'));

console.log(`Starting batch scrape for ${links.length} URLs...`);

const results = [];

// Record time before we start so we only grab NEW scrape_result files
const startTime = Date.now();

for (let i = 0; i < links.length; i++) {
    const url = links[i];
    console.log(`\n[${i+1}/${links.length}] Scraping: ${url}`);
    try {
        // Run pilot-scraper for each
        execSync(`node scripts/pilot-scraper.mjs "${url}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to scrape ${url}`);
    }
}

console.log("\nBatch scrape complete. Collecting results...");

// Find all scrape_result_*.json files generated
const files = fs.readdirSync(process.cwd());
for (const file of files) {
    if (file.startsWith('scrape_result_') && file.endsWith('.json')) {
        // Only include those generated in this run
        const timestamp = parseInt(file.split('_')[2].split('.')[0], 10);
        if (timestamp >= startTime) {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            results.push(data);
            // Clean up individual file
            fs.unlinkSync(file);
        }
    }
}

const outputFile = 'gasan_pilot_results.json';
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`✅ Saved ${results.length} results to ${outputFile}`);
