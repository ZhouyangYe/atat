const { storiesHandler, getRandomImages, getArticles } = require('@/core/handlers/stories');
const { METHOD_TYPE } = require('@/core/enum');

const storiesRoutes = {
  match: /^\/stories.*$/,
  handler: storiesHandler,
  namespace: 'stories',
  apis: [
    {
      url: '/images',
      method: METHOD_TYPE.GET,
      handler: getRandomImages,
    },
    {
      url: '/articles',
      method: METHOD_TYPE.GET,
      handler: getArticles,
    },
  ],
};

module.exports = { storiesRoutes };
