const http = require('http');
const { mainHandler } = require('./core/handlers');
const routerList = require('./router');

const PORT = 18080;

const server = http.createServer(mainHandler);

routerList.forEach((bindRouter) => {
  bindRouter();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
