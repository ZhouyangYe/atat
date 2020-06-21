const { deliverHtmlFile } = require('../utils');

const notFoundHandler = (req, res) => {
  deliverHtmlFile('notFound', res);
};

const notFoundApiHandler = (req, res) => {
  res.writeHead(404);
  res.write('Not found api!');
  res.end();
};

module.exports = {
  notFoundHandler,
  notFoundApiHandler,
};
