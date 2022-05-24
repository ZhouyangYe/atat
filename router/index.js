const coreHandler = require('../core/handlers');
const { COMMON_ROUTE, API_NOT_FOUND } = require('./enum');
const config = require('../utils/config');

const routeList = require('./routes');

const bindApis = (apis, prefix) => {
  if (apis && apis.length > 0) {
    apis.forEach(api => {
      const { url, method, handler, middleware } = api;
      
      const combinedUrl = `${prefix}${url}`;
      if (method && handler && url) {
        coreHandler[method](combinedUrl, handler, middleware);
      }

      bindApis(api.children, combinedUrl);
    });
  }
};

const bindAllRoutes = () => {
  routeList.forEach(route => {
    const { match, handler, namespace, apis } = route;
    if (match && handler) {
      coreHandler.get(match, handler);
    }

    if (namespace === API_NOT_FOUND) {
      coreHandler.post(match, handler);
    }

    const baseUrl = config.API_BASE_URL;
    const prefix = namespace === COMMON_ROUTE ? '' : `/${namespace}`;
    const combinedUrl = `/${baseUrl}${prefix}`;
    bindApis(apis, combinedUrl);
  });
};

module.exports = bindAllRoutes;
