/**
 * create-test-user.js
 * 
 * Creates the E2E test user in Supabase Auth via the Admin API.
 * Run once: node e2e/create-test-user.js
 */
const https = require('https');

const SUPABASE_URL = 'https://rhrkxuoybkdfdrknckjd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocmt4dW95YmtkZmRya25ja2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUxMDE5MiwiZXhwIjoyMDg3MDg2MTkyfQ.i2c7VW9uXoaEu9tZyD0k9OESiluK1OEkaGQxX7Z8qaU';

const body = JSON.stringify({
  email: 'e2e-tester@test.marinduque.local',
  password: 'E2eTestPass2026!',
  email_confirm: true,
});

const url = new URL(`${SUPABASE_URL}/auth/v1/admin/users`);
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Test user created:', json.email, '(id:', json.id + ')');
    } else if (json.message?.includes('already registered')) {
      console.log('ℹ️  Test user already exists — no action needed.');
    } else {
      console.error('❌ Failed to create test user:', JSON.stringify(json, null, 2));
      process.exit(1);
    }
  });
});

req.on('error', (err) => { console.error('Request error:', err); process.exit(1); });
req.write(body);
req.end();
