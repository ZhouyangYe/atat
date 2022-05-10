const { METHOD_TYPE } = require('@/core/enum');
const parse = require('./bodyParser');
const decorateRequest = require('./serverIO/request');
const decorateResponse = require('./serverIO/response');

const handlers = [];

const handleRequest = (type, req, res, cb) => {
  switch (type.toLowerCase()) {
    case METHOD_TYPE.GET: {
      cb(req, res);
      break;
    }
    case METHOD_TYPE.POST: {
      // parse body before proceeding
      parse(req).then((body) => {
        req.body = body;
        cb(req, res);
      });
      break;
    }
    default:
      break;
  }
};

// Iterate and run middleware
const applyMiddleware = (type,req, res, middleware, cb) => {
  let shouldRunNext = true;
  middleware.forEach((func, index) => {
    if (shouldRunNext) {
      shouldRunNext = false;
      let next = () => { shouldRunNext = true; };
      if (index === middleware.length - 1) {
        next = () => {
          handleRequest(type, req, res, cb);
        };
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
        applyMiddleware(type, req, res, middleware, cb);
      } else {
        handleRequest(type, req, res, cb);
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
  get,
  post,
  mainHandler,
  decorateIO,
};
