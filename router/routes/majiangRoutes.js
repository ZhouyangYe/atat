const { majiangHandler } = require('@/core/handlers/majiang');

const majiangRoutes = {
  match: '/majiang',
  handler: majiangHandler,
  namespace: 'majiang',
};

module.exports = { majiangRoutes };
