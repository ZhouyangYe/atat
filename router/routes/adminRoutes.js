const { adminHandler, loginHandler } = require('../../core/handlers/admin');
const { testMiddlewareHandler } = require('../../core/handlers/common/middleware');
const { METHOD_TYPE } = require('../../core/enum');

const adminRoutes = {
  match: /^\/admin$/,
  handler: adminHandler,
  namespace: 'admin',
  apis: [
    {
      url: '/login',
      method: METHOD_TYPE.POST,
      handler: loginHandler,
      middleware: [testMiddlewareHandler],
    },
  ],
};

module.exports = { adminRoutes };
