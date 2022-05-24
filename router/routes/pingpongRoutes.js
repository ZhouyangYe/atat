const { pingpongHandler } = require('@/core/handlers/pingpong');

const pingpongRoutes = {
  match: '/pingpong',
  handler: pingpongHandler,
  namespace: 'pingpong',
};

module.exports = { pingpongRoutes };
