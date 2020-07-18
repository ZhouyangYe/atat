const { staticFileRoutes } = require('./staticFileRoutes');

const { algorithmsRoutes } = require('./algorithmsRoutes');
const { hahahaRoutes } = require('./hahahaRoutes');
const { homeRoutes } = require('./homeRoutes');
const { introRoutes } = require('./introRoutes');
const { pingpongRoutes } = require('./pingpongRoutes');
const { adminRoutes } = require('./adminRoutes');

const { commonRoutes } = require('./commonRoutes');
const { notFoundRoutes, notFoundApiRoutes } = require('./notFoundRoutes');

module.exports = [
  // Static files
  staticFileRoutes,
  // Main routes
  algorithmsRoutes,
  hahahaRoutes,
  homeRoutes,
  introRoutes,
  pingpongRoutes,
  adminRoutes,
  // Common api routes
  commonRoutes,
  // Not found
  notFoundApiRoutes,
  notFoundRoutes,
];
