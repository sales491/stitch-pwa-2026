import { chromium } from 'playwright';
import * as fs from 'fs';

async function searchGasanBusinesses() {
    console.log("🔍 Launching browser to search for Gasan businesses on Facebook...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const query = `site:facebook.com "Gasan, Marinduque" restaurant OR resort OR store OR business OR cafe`;
    
    try {
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&num=30`, { waitUntil: 'networkidle' });
        
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
        
        console.log(`✅ Found ${uniqueLinks.length} unique business pages in Gasan!`);
        
        fs.writeFileSync('gasan_business_links.json', JSON.stringify(uniqueLinks, null, 2));
        console.log("Saved URLs to gasan_business_links.json. You can now feed these to the pilot-scraper.");
        
        await browser.close();
    } catch (e) {
        console.error("❌ Search failed:", e.message);
        await browser.close();
    }
}

searchGasanBusinesses();
