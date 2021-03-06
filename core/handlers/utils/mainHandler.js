const { METHOD_TYPE } = require('@/core/enum');
const decorateRequest = require('./serverIO/request');
const decorateResponse = require('./serverIO/response');

const handlers = [];

// Iterate and run middleware
const applyMiddleware = (req, res, middleware, cb) => {
  let shouldRunNext = true;
  middleware.forEach((func, index) => {
    if (shouldRunNext) {
      shouldRunNext = false;
      let next = () => { shouldRunNext = true; };
      if (index === middleware.length - 1) {
        next = () => { cb(req, res); };
      }
      func(req, res, next);
    }
  });
}

const getMethod = (type) => {
  const method = (pattern, cb, middleware) => {
    const handler = (req, res) => {
      const isRegex = typeof pattern === 'object';

      if (
        req.method.toLowerCase() !== type ||
        (isRegex && !pattern.test(req.url)) ||
        (!isRegex && pattern !== req.url)
      ) {
        return false;
      }

      if (middleware && middleware.length) {
        applyMiddleware(req, res, middleware, cb);
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
  // Add custom functions to req and res
  decorateIO(req, res);

  for (const index in handlers) {
    const found = handlers[index](req, res);
    if (found) return;
  }

  res.writeHead(404);
  res.write('Not found!');
  res.end();
};

module.exports = {
  get,
  post,
  mainHandler,
};
