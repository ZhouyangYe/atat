const { testHandler } = require('@/core/handlers/test');

const testRoutes = {
  match: '/test',
  handler: testHandler,
  namespace: 'test',
};

module.exports = { testRoutes };
