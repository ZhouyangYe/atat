const { introHandler, getIntroInfo } = require('../../core/handlers/intro');
const { METHOD_TYPE } = require('../../core/enum');

const introRoutes = {
  match: /^\/*$/,
  handler: introHandler,
  namespace: 'intro',
  apis: [
    {
      url: '/info',
      method: METHOD_TYPE.GET,
      handler: getIntroInfo,
    },
  ],
};

module.exports = { introRoutes };
