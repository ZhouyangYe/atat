const { algorithmsHandler } = require('../../core/handlers/algorithms');

const algorithmsRoutes = {
  match: /^\/algorithms$/,
  handler: algorithmsHandler,
  namespace: 'algorithms',
};

module.exports = { algorithmsRoutes };
