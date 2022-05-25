const { storiesHandler, getRandomImages } = require('@/core/handlers/stories');
const { METHOD_TYPE } = require('@/core/enum');

const storiesRoutes = {
  match: /^\/stories$/,
  handler: storiesHandler,
  namespace: 'stories',
  apis: [
    {
      url: '/images',
      method: METHOD_TYPE.GET,
      handler: getRandomImages,
    },
  ],
};

module.exports = { storiesRoutes };
