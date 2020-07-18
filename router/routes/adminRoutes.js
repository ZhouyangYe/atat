const { adminHandler } = require('../../core/handlers/admin');

const adminRoutes = {
  match: /^\/admin$/,
  handler: adminHandler,
  namespace: 'admin',
};

module.exports = { adminRoutes };
