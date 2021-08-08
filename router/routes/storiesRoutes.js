const { storiesHandler } = require('../../core/handlers/stories');

const storiesRoutes = {
  match: /^\/stories$/,
  handler: storiesHandler,
  namespace: 'stories',
};

module.exports = { storiesRoutes };
