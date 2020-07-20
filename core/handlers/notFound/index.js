const notFoundHandler = (req, res) => {
  res.html('notFound');
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
