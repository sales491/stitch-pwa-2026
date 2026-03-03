import fs from 'node:fs';
import path from 'node:path';

const componentsDir = path.resolve('src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const routeMapping = [
    { text: 'Home', path: '/marinduque-connect-home-feed' },
    { text: 'Market', path: '/marinduque-classifieds-marketplace' },
    { text: 'Classifieds', path: '/marinduque-classifieds-marketplace' },
    { text: 'Commute', path: '/commuter-delivery-hub' },
    { text: 'Transport', path: '/commuter-delivery-hub' },
    { text: 'Directory', path: '/marinduque-business-directory' },
    { text: 'Profile', path: '/user-profile-dashboard1' },
    { text: 'Messages', path: '/community-board-commuter-hub' },
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

    // Replace links matching inner keywords (regardless of their current href)
    for (const mapping of routeMapping) {
        // Matches <a ... href="..." ...>...`mapping.text`...</a>
        // It captures 
        // 1. everything up to href="
        // 2. the actual href path
        // 3. "
        // 4. the rest of the tag including the inner HTML that matches the keyword.
        const regex = new RegExp(`(<a[^>]+href=")([^"]+)(")([^>]*?>[\\s\\S]*?\\b${mapping.text}\\b[\\s\\S]*?<\\/a>)`, 'ig');
        newContent = newContent.replace(regex, `$1${mapping.path}$3$4`);
    }

    if (content !== newContent) {
        fs.writeFileSync(path.join(componentsDir, file), newContent);
        changedCount++;
    }
}

console.log(`Updated navigational links across ${changedCount} component files.`);
