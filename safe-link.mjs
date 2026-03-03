import fs from 'node:fs';
import path from 'node:path';

const componentsDir = path.resolve('src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const routeMapping = [
    { text: 'Home', path: '/marinduque-connect-home-feed' },
    { text: 'Market', path: '/marinduque-classifieds-marketplace' },
    { text: 'Commute', path: '/commuter-delivery-hub' },
    { text: 'Directory', path: '/marinduque-business-directory' },
    { text: 'Profile', path: '/user-profile-dashboard1' },
    { text: 'Messages', path: '/community-board-commuter-hub' },
    { text: 'Classifieds', path: '/classifieds-category-view' },
    { text: 'Jobs', path: '/marinduque-jobs-listing-feed' },
    { text: 'Events', path: '/marinduque-events-calendar' },
    { text: 'Create', path: '/create-new-listing' },
    { text: 'View All', path: '/marinduque-classifieds-marketplace' },
    { text: 'See all', path: '/marinduque-classifieds-marketplace' },
    { text: 'Post', path: '/create-new-listing' }
];

let changedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    let newContent = content;

    // Replace links with href="#" matching inner keywords
    for (const mapping of routeMapping) {
        // Find <a ... href="#" ...>...Keyword...</a>
        const regex = new RegExp(`(<a[^>]+href=")#?(")([^>]*?>[\\s\\S]*?(?:${mapping.text})[\\s\\S]*?<\\/a>)`, 'ig');
        newContent = newContent.replace(regex, `$1${mapping.path}$2$3`);
    }

    // Generic href="#" fallback to home to prevent page reload loops
    newContent = newContent.replace(/href="#"/g, 'href="/marinduque-connect-home-feed"');

    if (content !== newContent) {
        fs.writeFileSync(path.join(componentsDir, file), newContent);
        changedCount++;
    }
}

console.log(`Safely linked pages in ${changedCount} component files.`);
