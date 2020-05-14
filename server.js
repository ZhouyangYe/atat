const fs = require('fs');
const http = require('http');

const PORT = 18080;

const server = http.createServer((req, res) => {
  console.log(req.url);
  const ext = req.url.split('.')[1];
  console.log('Requesting for: ' + ext);
  let filePath = '';
  let contentType = '';

  switch (ext) {
    case 'css':
      filePath = './apps/pingpong/style.css';
      contentType = 'text/css';
      break;
    case 'js':
      filePath = './apps/pingpong/main.js';
      contentType = 'text/javascript';
      break;
    case 'io':
      filePath = './node_modules/socket.io-client/dist/socket.io.js';
      contentType = 'text/javascript';
      break;
    default:
      filePath = './apps/pingpong/index.html';
      contentType = 'text/html';
  }

  fs.readFile(filePath, (err, data) => {
    console.log('Rendering...');
    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': data.length });
    res.write(data);
    res.end();
    console.log('Finished rendering');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;