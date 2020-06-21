const http = require('http');
const { mainHandler } = require('./core/handlers');
const bindAllRoutes = require('./router');
const config = require('./config');

const PORT = config.WEB_PORT;

const server = http.createServer(mainHandler);

bindAllRoutes();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
