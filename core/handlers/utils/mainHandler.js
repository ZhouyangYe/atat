const { METHOD_TYPE } = require('@/core/enum');
const decorateRequest = require('./serverIO/request');
const decorateResponse = require('./serverIO/response');

const handlers = [];
const serverMiddleware = [];

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
  const method = (pattern, cb, middleware = []) => {
    const combinedMiddleware = [...serverMiddleware, ...middleware];
    const handler = (req, res) => {
      const isRegex = typeof pattern === 'object';

      if (
        req.method.toLowerCase() !== type ||
        (isRegex && !pattern.test(req.url)) ||
        (!isRegex && pattern !== req.url)
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
    handlers.push(handler);
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
  for (const index in handlers) {
    const found = handlers[index](req, res);
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
