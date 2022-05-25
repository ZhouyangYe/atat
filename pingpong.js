require('./utils/overrideRequire');
const logger = require('./utils/logger');
const { startPingpongServer } = require('./core/pingpong');
const config = require('./utils/config');
const server = require('http').createServer();

const PORT = config.PINGPONG_PORT;
const io = require('socket.io')(server, {
  cors: true,
});
startPingpongServer(io);

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on ${PORT}`);
});
