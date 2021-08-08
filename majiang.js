require('./utils/overrideRequire');
const { startMajiangServer } = require('./core/majiang');
const config = require('./config');
const server = require('http').createServer();

const PORT = config.PINGPONG_PORT;
const io = require('socket.io')(server);
startMajiangServer(io);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on ${PORT}`);
});

