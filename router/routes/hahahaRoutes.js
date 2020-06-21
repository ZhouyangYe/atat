const { hahahaHandler } = require('../../core/handlers/hahaha');

const hahahaRoutes = {
  match: /^\/hahaha$/,
  handler: hahahaHandler,
  namespace: 'hahaha',
};

module.exports = { hahahaRoutes };
