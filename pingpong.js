const startPingpongServer = require('./core/pingpong');

const PORT = 8080;
var io = require('socket.io')();
io.listen(PORT);

startPingpongServer(io);
