require('./utils/overrideRequire');
const logger = require('./utils/logger');
const { startMajiangServer } = require('./core/majiang');
const config = require('./utils/config');
const server = require('http').createServer();

const PORT = config.MAJIANG_PORT;
const io = require('socket.io')(server, {
  cors: true,
});
startMajiangServer(io);

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on ${PORT}`);
});

