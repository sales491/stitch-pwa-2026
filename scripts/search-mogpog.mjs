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

async function searchMogpogBusinesses() {
    console.log("🔍 Launching browser to search for Mogpog businesses on Facebook...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
        viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();
    
    // Search for common business types in Mogpog
    const query = `site:facebook.com "Mogpog" Marinduque restaurant OR pharmacy OR store`;
    
    try {
        await randomDelay(2000, 4000);
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle' });
        
        console.log("Waiting for search results...");
        await page.waitForSelector('div#main', { timeout: 60000 });
        await randomDelay(1000, 3000);
        
        // Extract Facebook links
        const links = await page.$$eval('a', anchors => {
            return anchors
                .map(a => a.href)
                .filter(href => href.includes('facebook.com') && !href.includes('/groups/') && !href.includes('/events/') && !href.includes('/posts/') && !href.includes('/photo'))
                .map(href => {
                    try {
                        const url = new URL(href);
                        return url.origin + url.pathname;
                    } catch(e) {
                        return href;
                    }
                });
        });

        const uniqueLinks = [...new Set(links)];
        
        console.log(`✅ Found ${uniqueLinks.length} unique business pages in Mogpog!`);
        
        fs.writeFileSync('mogpog_business_links.json', JSON.stringify(uniqueLinks, null, 2));
        console.log("Saved URLs to mogpog_business_links.json.");
        
        await browser.close();
    } catch (e) {
        console.error("❌ Search failed:", e.message);
        await browser.close();
    }
}

searchMogpogBusinesses();
