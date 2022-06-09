const { METHOD_TYPE, METHOD_MODE } = require('@/core/enum');
const config = require('@/utils/config');
const decorateRequest = require('./serverIO/request');
const decorateResponse = require('./serverIO/response');

const handlers = {
  [METHOD_MODE.PAGE]: [],
  [METHOD_MODE.API]: [],
};
const serverMiddleware = [];

const testUrl = (req, pattern, url) => {
  const isRegex = typeof pattern === 'object';

  // support query
  const
    path = url.split('?')[0];
  
  req.path = path;

  if (isRegex) {
    return pattern.test(path);
  }

  const
    units = path.split('/').slice(1),
    pUnits = pattern.split('/').slice(1),
    params = {};

  if (units.length !== pUnits.length && !(pUnits.length - units.length === 1 && /^:.*/.test(pUnits[pUnits.length - 1]))) {
    return false;
  }

  for (let i = 0, length = pUnits.length; i < length; i++) {
    // support /:something
    if (/^:.*/.test(pUnits[i])) {
      params[pUnits[i].slice(1)] = units[i];
      continue;
    }

    if (units[i] !== pUnits[i]) {
      return false;
    }
  }

  req.params = params;

  return true;
};

const use = (middleware) => {
  serverMiddleware.push(middleware);
};

// Recursively run middleware
const applyMiddleware = (req, res, middleware, cb) => {
  let extra = {};

  let i = 0;
  const next = (data) => {
    i++;
    if (data) extra = { ...extra, ...data };

    if (i < middleware.length) {
      middleware[i](req, res, next, extra);
    } else {
      cb(req, res, extra);
    }
  };
  middleware[i](req, res, next, extra);
};

const getMethod = (type) => {
  const method = (pattern, cb, middleware = [], mode = METHOD_MODE.API) => {
    const combinedMiddleware = [...serverMiddleware, ...middleware];
    const handler = (req, res) => {
      if (
        req.method.toLowerCase() !== type || !testUrl(req, pattern, req.url)
      ) {
        return false;
      }

      if (combinedMiddleware.length) {
        applyMiddleware(req, res, combinedMiddleware, cb);
      } else {
        cb(req, res);
      }

      return true;
    };

    handlers[mode].push(handler);
  };
  return method;
};

const get = getMethod(METHOD_TYPE.GET);
const post = getMethod(METHOD_TYPE.POST);

const decorateIO = (req, res) => {
  decorateRequest(req);
  decorateResponse(res);
}

const mainHandler = (req, res) => {
  const list = new RegExp(`^/${config.API_BASE_URL}/.*`).test(req.url) ? handlers[METHOD_MODE.API] : handlers[METHOD_MODE.PAGE];
  for (const index in list) {
    const found = list[index](req, res);
    if (found) return;
  }

  res.writeHead(404);
  res.write('Not found!');
  res.end();
};

module.exports = {
  use,
  get,
  post,
  mainHandler,
  decorateIO,
};
