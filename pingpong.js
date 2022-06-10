require('./utils/overrideRequire');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { startPingpongServer } = require('./core/pingpong');
const config = require('./utils/config');
const server = require('https').createServer({
  key: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.KEY}`)),
  cert: fs.readFileSync(path.resolve(__dirname, `./utils/ssl/${config.CERT}`)),
});

const PORT = config.PINGPONG_PORT;
const io = require('socket.io')(server, {
  cors: true,
});
startPingpongServer(io);

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on ${PORT}`);
});
