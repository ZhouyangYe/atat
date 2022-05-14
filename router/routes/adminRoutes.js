const { adminHandler, loginHandler, resumeHandler, logoutHandler } = require('../../core/handlers/admin');
const { checkWhetherAlreadyLoggedIn, checkWhetherLoggedIn, comparePassword } = require('../../core/handlers/admin/middleware');
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
        checkWhetherAlreadyLoggedIn,
        comparePassword,
      ],
    },
    {
      url: '/logout',
      method: METHOD_TYPE.POST,
      handler: logoutHandler,
      middleware: [
        checkWhetherLoggedIn,
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
