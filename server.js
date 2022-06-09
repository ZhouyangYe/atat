require('./utils/overrideRequire');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { mainHandler, decorateIO, use, bodyParser } = require('./core/handlers');
const bindAllRoutes = require('./router');
const config = require('./utils/config');
const logger = require('./utils/logger');

const HTTP_PORT = config.HTTP_PORT;
const HTTPS_PORT = config.HTTPS_PORT;

decorateIO(http.ClientRequest.prototype, http.ServerResponse.prototype);
const httpsServer = https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.KEY}`)),
  cert: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.CERT}`)),
}, mainHandler);

// redirect from http to https
const httpServer = http.createServer((req, res) => {
  const hostname = req.headers.host.split(':')[0];
  const redirectPort = hostname === 'localhost' ? `:${HTTPS_PORT}` : '';
  res.writeHead(301, { 'Location': `https://${hostname}${redirectPort}${req.url}` });
  res.end();
});

use(bodyParser);
bindAllRoutes();

httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
  logger.info(`HTTPS: Listening on port ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
  logger.info(`HTTP: Listening on port ${HTTP_PORT}`);
});
