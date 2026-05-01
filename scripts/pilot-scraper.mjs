import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';

chromium.use(stealth());

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function randomDelay(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
}

async function getGoogleSnippet(name) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ userAgent: getRandomUserAgent() });
    const page = await context.newPage();
    const query = `site:facebook.com "${name}" phone number Marinduque`;
    console.log(`🔍 Checking Google Snippets for: ${name}...`);
    
    try {
        await randomDelay(1500, 3000);
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle' });
        await randomDelay(1000, 2000);
        const snippetText = await page.innerText('body');
        
        const phoneRegex = /(?:\+63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/g;
        const phones = snippetText.match(phoneRegex) || [];
        
        await browser.close();
        return [...new Set(phones)];
    } catch (e) {
        await browser.close();
        return [];
    }
}

async function scrapeFacebookPage(url) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
        viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();

    const aboutUrl = url.endsWith('/') ? `${url}about` : `${url}/about`;
    console.log(`🔎 Accessing: ${aboutUrl}...`);
    
    try {
        await randomDelay(1500, 3000);
        await page.goto(aboutUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        const bodyText = await page.innerText('body');
        const title = await page.title();
        const cleanName = title.split('|')[0].trim();

        // Phone extraction
        const phoneRegex = /(?:\+63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/g;
        const fbPhones = bodyText.match(phoneRegex) || [];
        
        // Email extraction
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = bodyText.match(emailRegex) || [];

        // Address hints
        const keywords = ['Boac', 'Marinduque', 'Street', 'Brgy', 'Barangay', 'St.', 'Poblacion'];
        const addressLines = bodyText.split('\n').filter(line => 
            keywords.some(keyword => line.includes(keyword)) && line.length < 80
        );

        // Path 2: Google Check (Fast Snippet Search)
        const googlePhones = await getGoogleSnippet(cleanName);

        const results = {
            name: cleanName,
            url: url,
            phones: [...new Set([...fbPhones, ...googlePhones])],
            emails: [...new Set(emails)],
            address_snippets: [...new Set(addressLines)].slice(0, 5),
            scraped_at: new Date().toISOString()
        };

        await browser.close();
        return results;

    } catch (error) {
        console.error(`❌ Error scanning ${url}:`, error.message);
        await browser.close();
        return { error: error.message, url };
    }
}

// CLI Support
const targetUrl = process.argv[2];
if (!targetUrl) {
    console.log("Usage: node scripts/pilot-scraper.mjs <facebook-url>");
    process.exit(1);
}

scrapeFacebookPage(targetUrl).then(data => {
    console.log("\n--- SCRAPED DATA ---");
    console.log(JSON.stringify(data, null, 2));
    
    const filename = `scrape_result_${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n✅ Saved to ${filename}`);
});
