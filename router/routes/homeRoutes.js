const { homeHandler } = require('../../core/handlers/home');
const { test } = require('../../core/handlers/common');
const { METHOD_TYPE } = require('../../core/enum');

const homeRoutes = {
  match: /^\/home.*$/,
  handler: homeHandler,
  namespace: 'home',
  apis: [
    {
      url: '/test',
      method: METHOD_TYPE.GET,
      handler: test,
    },
  ],
};

module.exports = { homeRoutes };
