require('./utils/overrideRequire');
const http = require('http');
const { mainHandler, decorateIO, use, bodyParser } = require('./core/handlers');
const bindAllRoutes = require('./router');
const config = require('./utils/config');
const logger = require('./utils/logger');

const PORT = config.WEB_PORT;

decorateIO(http.ClientRequest.prototype, http.ServerResponse.prototype);
const server = http.createServer(mainHandler);

use(bodyParser);
bindAllRoutes();

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on port ${PORT}`);
});
