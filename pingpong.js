const { startPingPongServer } = require('./core/pingpong');
const config = require('./config');

const PORT = config.PINGPONG_PORT;
var io = require('socket.io')();
io.listen(PORT);

startPingPongServer(io);
