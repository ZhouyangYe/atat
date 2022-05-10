const testMiddlewareHandler = (req, res, next) => {
  console.log('middleware');
  console.log(req.url);
  next({ t: 'hello' });
};

module.exports = {
  testMiddlewareHandler,
};
