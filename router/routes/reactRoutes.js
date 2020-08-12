const { reactHandler } = require('../../core/handlers/react');

const reactRoutes = {
  match: /^\/react$/,
  handler: reactHandler,
  namespace: 'react',
};

module.exports = { reactRoutes };
