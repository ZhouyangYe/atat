const METHOD_TYPE = {
  GET: 'GET',
  POST: 'POST'
};

const handlers = [];

const getMethod = (type) => {
  const method = (pattern, cb) => {
    const handler = (req, res) => {
      if (req.method.toUpperCase() !== type || !pattern.test(req.url)) {
        return false;
      }
      cb(req, res);
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
  mainHandler
};
