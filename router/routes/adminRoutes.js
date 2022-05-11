const { adminHandler, loginHandler } = require('../../core/handlers/admin');
const { checkWhetherLogedIn, comparePassword } = require('../../core/handlers/admin/middleware');
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
      middleware: [
        checkWhetherLogedIn,
        comparePassword,
      ],
    },
  ],
};

module.exports = { adminRoutes };
