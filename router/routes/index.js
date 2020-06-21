const { algorithmsRoutes } = require('./algorithmsRoutes');
const { hahahaRoutes } = require('./hahahaRoutes');
const { homeRoutes } = require('./homeRoutes');
const { introRoutes } = require('./introRoutes');
const { notFoundRoutes, notFoundApiRoutes } = require('./notFoundRoutes');
const { pingpongRoutes } = require('./pingpongRoutes');
const { staticFileRoutes } = require('./staticFileRoutes');
const { commonRoutes } = require('./commonRoutes');

module.exports = [
  // Static files
  staticFileRoutes,
  // Main routes
  algorithmsRoutes,
  hahahaRoutes,
  homeRoutes,
  introRoutes,
  pingpongRoutes,
  // Common api routes
  commonRoutes,
  // Not found
  notFoundApiRoutes,
  notFoundRoutes,
];
