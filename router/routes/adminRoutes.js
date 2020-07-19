const { adminHandler } = require('../../core/handlers/admin');
const { testHandler } = require('../../core/handlers/common');
const { testMiddlewareHandler } = require('../../core/handlers/common/middleware');
const { METHOD_TYPE } = require('../../core/enum');

const adminRoutes = {
  match: /^\/admin$/,
  handler: adminHandler,
  namespace: 'admin',
  apis: [
    {
      url: '/login',
      method: METHOD_TYPE.GET,
      handler: testHandler,
      middleware: [testMiddlewareHandler],
    },
  ],
};

module.exports = { adminRoutes };
