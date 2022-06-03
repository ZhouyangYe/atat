const { staticFileRoutes } = require('./staticFileRoutes');

const { storiesRoutes } = require('./storiesRoutes');
const { homeRoutes } = require('./homeRoutes');
const { introRoutes } = require('./introRoutes');
const { majiangRoutes } = require('./majiangRoutes');
const { pingpongRoutes } = require('./pingpongRoutes');
const { adminRoutes } = require('./adminRoutes');
const { testRoutes } = require('./testRoutes');

const { commonRoutes } = require('./commonRoutes');
const { notFoundApiRoutes } = require('./notFoundRoutes');

module.exports = [
  // Common api routes
  commonRoutes,
  // Static files
  staticFileRoutes,
  // Main routes
  homeRoutes,
  introRoutes,
  majiangRoutes,
  pingpongRoutes,
  adminRoutes,
  testRoutes,
  // Main SPA page
  storiesRoutes,
  // Not found
  notFoundApiRoutes,
];
