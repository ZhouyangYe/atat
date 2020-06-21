const testMiddlewareHandler = (req, res, next) => {
  console.log('middleware');
  console.log(req.url);
  next();
};

module.exports = {
  testMiddlewareHandler,
};
