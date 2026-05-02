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

async function searchBoacBusinesses() {
    console.log("🔍 Launching visible browser to search for Boac businesses on Facebook...");
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
        viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();
    
    // Updated query for Event Services categories
    const query = `site:facebook.com "Boac, Marinduque" photography OR catering OR "party needs" OR events`;
    
    try {
        await randomDelay(1500, 3000);
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&num=30`, { waitUntil: 'networkidle' });
        
        // Wait for results to load, giving you time to solve CAPTCHA if it appears
        console.log("Waiting for search results... (If you see a CAPTCHA, please solve it now)");
        await page.waitForSelector('#search', { timeout: 120000 }); // wait up to 2 minutes
        await randomDelay(2000, 5000);
        
        // Extract all Facebook links from Google search results
        const links = await page.$$eval('a', anchors => {
            return anchors
                .map(a => a.href)
                .filter(href => href.includes('facebook.com') && !href.includes('/groups/') && !href.includes('/events/') && !href.includes('/posts/') && !href.includes('/photo'))
                .map(href => {
                    // Clean tracking params
                    try {
                        const url = new URL(href);
                        return url.origin + url.pathname;
                    } catch(e) {
                        return href;
                    }
                });
        });

        // Deduplicate
        const uniqueLinks = [...new Set(links)];
        
        console.log(`✅ Found ${uniqueLinks.length} unique business pages in Boac!`);
        
        fs.writeFileSync('boac_business_links.json', JSON.stringify(uniqueLinks, null, 2));
        console.log("Saved URLs to boac_business_links.json. You can now feed these to the pilot-scraper.");
        
        await browser.close();
    } catch (e) {
        console.error("❌ Search failed:", e.message);
        await browser.close();
    }
}

searchBoacBusinesses();
