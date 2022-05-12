const { adminHandler, loginHandler, resumeHandler } = require('../../core/handlers/admin');
const { checkWhetherLoggedIn, comparePassword } = require('../../core/handlers/admin/middleware');
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
        checkWhetherLoggedIn,
        comparePassword,
      ],
    },
    {
      url: '/resume',
      method: METHOD_TYPE.POST,
      handler: resumeHandler,
      middleware: [
        checkWhetherLoggedIn,
      ],
    }
  ],
};

module.exports = { adminRoutes };
