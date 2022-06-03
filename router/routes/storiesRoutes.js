const { storiesHandler, getRandomImages, getAlbum, getArticle } = require('@/core/handlers/stories');
const { METHOD_TYPE } = require('@/core/enum');

const storiesRoutes = {
  match: /.*/,
  handler: storiesHandler,
  namespace: 'stories',
  apis: [
    {
      url: '/images',
      method: METHOD_TYPE.GET,
      handler: getRandomImages,
    },
    {
      url: '/album',
      method: METHOD_TYPE.GET,
      handler: getAlbum,
    },
    {
      url: '/articles',
      method: METHOD_TYPE.GET,
      handler: getArticle,
    },
  ],
};

module.exports = { storiesRoutes };
