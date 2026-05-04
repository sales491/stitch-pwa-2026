/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');

const query = '[out:json];area["name"="Marinduque"]->.searchArea;(way["highway"~"primary|secondary"](area.searchArea););out geom;';
const dataString = 'data=' + encodeURIComponent(query);

const options = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(dataString),
    'User-Agent': 'MarinduqueMarketHub/1.0'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (!json.elements) {
          console.error('No elements found. Response:', data.substring(0,200));
          return;
      }
      const lines = json.elements.filter(e => e.type === 'way').map(way => way.geometry.map(pt => [pt.lon, pt.lat]));
      fs.writeFileSync('src/data/marinduque-roads.json', JSON.stringify(lines));
      console.log('Saved roads! Found', lines.length, 'road segments.');
    } catch (e) {
      console.error('Error parsing:', e.message);
    }
  });
});

req.on('error', e => {
  console.error('Problem with request:', e.message);
});

req.write(dataString);
req.end();
