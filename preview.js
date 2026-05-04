/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require('child_process');
const http = require('http');

const URL = 'http://localhost:3000';
const MAX_ATTEMPTS = 10;
const DELAY = 2000;
let attempts = 0;

function launch() {
  attempts++;
  const start = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  http.get(URL, (res) => {
    console.log(`✅ Server is live! Opening browser...`);
    exec(`${start} ${URL}`, (err) => {
      if (err) console.error('❌ Failed to open browser:', err);
    });
  }).on('error', () => {
    if (attempts < MAX_ATTEMPTS) {
      console.log(`⏳ [${attempts}/${MAX_ATTEMPTS}] Waiting for ${URL} to respond...`);
      setTimeout(launch, DELAY);
    } else {
      console.error(`❌ Server at ${URL} is not responding.`);
      console.error(`👉 Please ensure your server is running (e.g., "npm run dev").`);
    }
  });
}

console.log(`🚀 Initializing preview launcher...`);
launch();