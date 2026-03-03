import fs from 'node:fs';
import path from 'node:path';

const componentsDir = path.resolve('src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let changedFilesCount = 0;

for (const file of files) {
    let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    let originalContent = content;

    // 1. Replace <a href="#"> mapping based on the text inside the anchor
    const anchorMappings = [
        { keyword: 'Home', route: '/marinduque-connect-home-feed' },
        { keyword: 'Market', route: '/marinduque-classifieds-marketplace' },
        { keyword: 'Commute', route: '/commuter-delivery-hub' },
        { keyword: 'Profile', route: '/user-profile-dashboard1' },
        { keyword: 'Directory', route: '/marinduque-business-directory' },
        { keyword: 'Classifieds', route: '/classifieds-category-view' },
        { keyword: 'Jobs', route: '/marinduque-jobs-listing-feed' },
        { keyword: 'Transport', route: '/commuter-delivery-hub' },
        { keyword: 'Events', route: '/marinduque-events-calendar' },
        { keyword: 'View All', route: '/marinduque-classifieds-marketplace' },
        { keyword: 'See all', route: '/marinduque-classifieds-marketplace' },
        { keyword: 'Messages', route: '/community-board-commuter-hub' }, // fallback
    ];

    anchorMappings.forEach(mapping => {
        // Regex matches `<a ...> ... Keyword ... </a>`
        // It captures group 1 as the first part of the anchor tag up to the href value, 
        // and correctly injects the new route.
        const regex = new RegExp(`(<a[^>]*?href=")(?:#|\\S*?)("[^>]*?>[\\s\\S]*?${mapping.keyword}[\\s\\S]*?<\\/a>)`, 'g');
        content = content.replace(regex, `$1${mapping.route}$2`);
    });

    // 2. Replace <button> ... Keyword ... </button> for Navigation elements
    // Converts buttons into anchor tags so they can legitimately link.
    const buttonNavKeywords = ['Home', 'Market', 'Commute', 'Profile', 'Directory', 'Messages', 'Events'];
    buttonNavKeywords.forEach(keyword => {
        const regex = new RegExp(`(<button)([^>]*?>[\\s\\S]*?${keyword}[\\s\\S]*?<)\\/button>`, 'g');
        content = content.replace(regex, (match, p1, p2) => {
            const route = anchorMappings.find(a => a.keyword === keyword)?.route || '#';
            // We replace <button with <a href="..." and </button> with </a>
            return `<a href="${route}"${p2}/a>`;
        });
    });

    // 3. Special case for the Floating Action "add" button. Text 'add' with huge text, typically 3xl or 2xl
    content = content.replace(/(<button)([^>]*?>[\s\S]*?>add<[\s\S]*?<)\/button>/g, (match, p1, p2) => {
        // check if it's the fab add button
        if (p2.includes('material-symbols') && p2.includes('add')) {
            return `<a href="/create-new-listing"${p2}/a>`;
        }
        return match;
    });

    // 4. Special case for Back buttons (arrow_back, arrow_left, close)
    content = content.replace(/(<button)([^>]*?>[\s\S]*?>(?:arrow_back|close)<[\s\S]*?<)\/button>/g, (match, p1, p2) => {
        return `<a href="/marinduque-connect-home-feed"${p2}/a>`; // Default back to home
    });

    // 5. Special case for Card Divs -> Make them Links if they look like cards
    // E.g. <div className="... cursor-pointer ..."> ... </div>
    // Actually transforming div -> a could break nested flex. Better to wrap them if possible, or just leave cards alone 
    // since prototype often just needs main navs to work to traverse 80% of pages. 
    // Let's specifically target grid cells in home feed

    // Specific card links
    content = content.replace(/href="#"/g, 'href="/marinduque-connect-home-feed"'); // any remaining `#` gets set to home safely.

    if (content !== originalContent) {
        fs.writeFileSync(path.join(componentsDir, file), content);
        changedFilesCount++;
    }
}

console.log(`Successfully linked navigational elements in ${changedFilesCount} component files!`);
