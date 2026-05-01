import { chromium } from 'playwright';
import * as fs from 'fs';

async function searchBoacBusinesses() {
    console.log("🔍 Launching visible browser to search for Boac businesses on Facebook...");
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const query = `site:facebook.com "Boac, Marinduque" boutique OR clothing OR "ukay-ukay" OR thrift OR apparel`;
    
    try {
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&num=30`, { waitUntil: 'networkidle' });
        
        // Wait for results to load, giving you time to solve CAPTCHA if it appears
        console.log("Waiting for search results... (If you see a CAPTCHA, please solve it now)");
        await page.waitForSelector('#search', { timeout: 120000 }); // wait up to 2 minutes
        
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
