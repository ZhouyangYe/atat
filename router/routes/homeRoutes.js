const { homeHandler } = require('../../core/handlers/home');
const { testHandler } = require('../../core/handlers/common');
const { testMiddlewareHandler } = require('../../core/handlers/common/middleware');
const { METHOD_TYPE } = require('../../core/enum');

const homeRoutes = {
  match: /^\/home.*$/,
  handler: homeHandler,
  namespace: 'home',
  apis: [
    {
      url: '/test',
      method: METHOD_TYPE.GET,
      handler: testHandler,
      middleware: [testMiddlewareHandler],
    },
  ],
};

module.exports = { homeRoutes };
