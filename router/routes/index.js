const { staticFileRoutes } = require('./staticFileRoutes');

const { storiesRoutes } = require('./storiesRoutes');
const { homeRoutes } = require('./homeRoutes');
const { introRoutes } = require('./introRoutes');
const { majiangRoutes } = require('./majiangRoutes');
const { pingpongRoutes } = require('./pingpongRoutes');
const { adminRoutes } = require('./adminRoutes');

const { commonRoutes } = require('./commonRoutes');
const { notFoundRoutes, notFoundApiRoutes } = require('./notFoundRoutes');

module.exports = [
  // Common api routes
  commonRoutes,
  // Static files
  staticFileRoutes,
  // Main routes
  storiesRoutes,
  homeRoutes,
  introRoutes,
  majiangRoutes,
  pingpongRoutes,
  adminRoutes,
  // Not found
  notFoundApiRoutes,
  notFoundRoutes,
];
