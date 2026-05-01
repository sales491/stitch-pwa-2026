import { execSync } from 'child_process';
import * as fs from 'fs';

function processBatch(location, jsonFile, resultsFile) {
    console.log(`\n--- Processing ${location} ---`);
    if (!fs.existsSync(jsonFile)) return;

    const links = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
        .filter(l => l.includes('facebook.com') && !l.includes('groups') && !l.includes('events') && !l.includes('login'));

    if (links.length === 0) {
        console.log(`No valid facebook links found for ${location}.`);
        return;
    }

    console.log(`Found ${links.length} valid links for ${location}. Scraping...`);
    const results = [];
    const startTime = Date.now();

    for (const url of links) {
        console.log(`Scraping ${url}...`);
        try {
            execSync(`node scripts/pilot-scraper.mjs "${url}"`, { stdio: 'inherit' });
        } catch (e) {
            console.error(`Failed to scrape ${url}`);
        }
    }

    const files = fs.readdirSync(process.cwd());
    for (const file of files) {
        if (file.startsWith('scrape_result_') && file.endsWith('.json')) {
            const timestamp = parseInt(file.split('_')[2].split('.')[0], 10);
            if (timestamp >= startTime) {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                results.push(data);
                fs.unlinkSync(file);
            }
        }
    }

    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`Saved ${results.length} scraped results for ${location}.`);
}

processBatch('Gasan', 'gasan_business_links.json', 'gasan_pilot_results.json');
processBatch('Boac', 'boac_business_links.json', 'boac_pilot_results.json');

console.log("\n--- Executing Sync Scripts ---");
try {
    execSync('node scripts/sync-gasan.mjs', { stdio: 'inherit' });
    execSync('node scripts/sync-boac.mjs', { stdio: 'inherit' });
} catch (e) {
    console.error("Error during sync:", e);
}

console.log("\n✅ All done!");
