const images = require('./images');

const storiesHandler = (req, res) => {
  res.html('stories');
};

module.exports = {
  ...images,
  storiesHandler,
};
