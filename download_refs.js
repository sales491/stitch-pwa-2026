/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');
const path = require('path');

const places = [
  'Ungab Rock Formation Marinduque',
  'Kawa Kawa Falls Marinduque',
  'Palad Sandbar Marinduque',
  'Bathala Caves Marinduque',
  'Mount Malindig Marinduque'
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64 AppleWebKit/537.36 Chrome/100.0.4896.127 Safari/537.36)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function downloadFirstImage(query, filename) {
  try {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    const html = await fetchHtml(url);
    const imgRegex = /src=\"(\/\/external-content\.duckduckgo\.com\/iu\/.*?)\"/;
    const match = html.match(imgRegex);
    if (!match) {
       console.log('No image found for ' + query);
       return;
    }
    let imgUrl = 'https:' + match[1];
    imgUrl = imgUrl.replace(/&amp;/g, '&');
    
    console.log('Downloading ' + imgUrl + ' to ' + filename);
    const file = fs.createWriteStream(filename);
    https.get(imgUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => file.close());
    });
  } catch (err) {
    console.log('Error for ' + query + ': ' + err);
  }
}

(async () => {
    const dir = 'C:\\Users\\mspen\\.gemini\\antigravity\\brain\\96178d98-74b3-4035-adbf-701e8c93c6a7\\artifacts';
    for (let i=0; i<places.length; i++) {
        const name = places[i].replace(/ /g, '_').toLowerCase();
        await downloadFirstImage(places[i], path.join(dir, name + '_reference.jpg'));
        await new Promise(r => setTimeout(r, 1500));
    }
})();
