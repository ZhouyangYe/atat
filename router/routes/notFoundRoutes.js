const { notFoundApiHandler } = require('../../core/handlers/notFound');
const { API_NOT_FOUND } = require('../enum');
const config = require('../../utils/config');

const notFoundApiRoutes = {
  match: new RegExp(`^/${config.API_BASE_URL}/.*`),
  handler: notFoundApiHandler,
  namespace: API_NOT_FOUND,
}

module.exports = { notFoundApiRoutes };
