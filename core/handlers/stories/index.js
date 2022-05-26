const images = require('./images');
const blog = require('./blog');

const storiesHandler = (req, res) => {
  res.html('stories');
};

module.exports = {
  ...images,
  ...blog,
  storiesHandler,
};
