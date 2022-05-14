const logger = require('@/utils/logger');

const testMiddlewareHandler = (req, res, next) => {
  logger.info('middleware');
  logger.info(req.url);
  next({ t: 'hello' });
};

module.exports = {
  testMiddlewareHandler,
};
