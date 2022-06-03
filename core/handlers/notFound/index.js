const notFoundApiHandler = (req, res) => {
  res.writeHead(404);
  res.write('Not found api!');
  res.end();
};

module.exports = {
  notFoundApiHandler,
};
