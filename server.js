require('./utils/overrideRequire');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { mainHandler, decorateIO, use, bodyParser } = require('./core/handlers');
const bindAllRoutes = require('./router');
const config = require('./utils/config');
const logger = require('./utils/logger');

const PORT = config.WEB_PORT;

decorateIO(http.ClientRequest.prototype, http.ServerResponse.prototype);
const server = https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.KEY}`)),
  cert: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.CERT}`)),
}, mainHandler);

use(bodyParser);
bindAllRoutes();

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on port ${PORT}`);
});
