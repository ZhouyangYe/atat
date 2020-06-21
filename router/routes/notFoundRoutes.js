const { notFoundHandler } = require('../../core/handlers/notFound');
const { notFoundApiHandler } = require('../../core/handlers/notFound');
const { API_NOT_FOUND } = require('../enum');
const config = require('../../config');

const notFoundApiRoutes = {
  match: new RegExp(`^\/${config.API_BASE_URL}\/.*`),
  handler: notFoundApiHandler,
  namespace: API_NOT_FOUND,
}

const notFoundRoutes = {
  match: /.*/,
  handler: notFoundHandler,
  namespace: 'notfound',
};

module.exports = { notFoundRoutes, notFoundApiRoutes };
