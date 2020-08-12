const { startPingPongServer } = require('./core/pingpong');
const config = require('./config');
const server = require('http').createServer();

const PORT = config.PINGPONG_PORT;
const io = require('socket.io')(server);
startPingPongServer(io);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on ${PORT}`);
});

