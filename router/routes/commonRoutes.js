const { testHandler } = require('../../core/handlers/common');
const { testMiddlewareHandler } = require('../../core/handlers/common/middleware');
const { COMMON_ROUTE } = require('../enum');
const { METHOD_TYPE } = require('../../core/enum');

const commonRoutes = {
  namespace: COMMON_ROUTE,
  apis: [
    {
      url: '/',
      method: METHOD_TYPE.GET,
      handler: testHandler,
      middleware: [testMiddlewareHandler],
    },
  ],
};

module.exports = { commonRoutes };
