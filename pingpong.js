const { startPingPongLogic } = require('./core/pingpong');

const PORT = 8080;
var io = require('socket.io')();
io.listen(PORT);

startPingPongLogic(io);
