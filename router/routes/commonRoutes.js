const { testHandler } = require('../../core/handlers/common');
const { testMiddlewareHandler } = require('../../core/handlers/common/middleware');
const { COMMON_ROUTE } = require('../enum');

const commonRoutes = {
  namespace: COMMON_ROUTE,
  apis: [
    {
      url: '/',
      method: 'get',
      handler: testHandler,
      middleware: [testMiddlewareHandler],
    },
  ],
};

module.exports = { commonRoutes };
