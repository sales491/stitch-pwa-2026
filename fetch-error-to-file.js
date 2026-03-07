const http = require('http');
const fs = require('fs');
http.get('http://localhost:3000/api/test-delete', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => { fs.writeFileSync('fetch-error-out.txt', data); });
});
