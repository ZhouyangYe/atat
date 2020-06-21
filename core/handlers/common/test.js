const testHandler = (req, res) => {
  res.write('Ready!');
  res.end();
};

module.exports = {
  testHandler,
};
