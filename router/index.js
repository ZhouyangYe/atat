const { get } = require('../core/handlers');
const { pingpongHandler } = require('../core/pingpong');
const notFoundHandler = require('../core/handlers/notFound');
const staticFileHandler = require('../core/handlers/staticFileHandler');

// static files
const bindRoutesForStaticFiles = () => {
  get(/(\.js|\.css|\.jpeg|\.jpg|\.png|\.gif|\.html|\.map|\.otf|\.woff|\.ttf|\.mp4|\.svg|\.ico)$/, staticFileHandler);
};

// PingPong
const bindRoutesForPingPong = () => {
  get(/^\/pingpong$/, pingpongHandler);
};

// Not Found
const bindRouteForNotFound = () => {
  get(/.*/, notFoundHandler);
};

module.exports = [
  bindRoutesForStaticFiles,
  bindRoutesForPingPong,
  bindRouteForNotFound
];
