const { introHandler } = require('../../core/handlers/intro');

const introRoutes = {
  match: /^\/*$/,
  handler: introHandler,
  namespace: 'intro',
};

module.exports = { introRoutes };
