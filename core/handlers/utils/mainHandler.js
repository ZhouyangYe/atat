const { METHOD_TYPE } = require('../../enum');

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

const mainHandler = (req, res) => {
  let found = false;

  for (const index in handlers) {
    found = handlers[index](req, res);
    if (found) break;
  }

  if (found) return;

  res.writeHead(404);
  res.write('Not found!');
  res.end();
};

module.exports = {
  get,
  post,
  mainHandler,
};