const { METHOD_TYPE } = require('@/core/enum');

module.exports = (req, res, next) => {
  switch (req.method.toLowerCase()) {
    case METHOD_TYPE.GET: {
      next();
      break;
    }
    case METHOD_TYPE.POST: {
      req.setEncoding('utf8');
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = undefined;
        }
        req.body = body;
        next();
      });
      break;
    }
    default:
      next();
      break;
  }
};
