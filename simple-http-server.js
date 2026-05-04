const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('UP');
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'success',
    message: 'This is a simple standalone HTTP server.',
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log(`HTTP Server is running at http://localhost:${PORT}`);
});