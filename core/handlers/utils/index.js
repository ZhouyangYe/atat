const { get, post, mainHandler } = require('./mainHandler');
const staticFileHandler = require('./staticFileHandler');

module.exports = {
  get,
  post,
  mainHandler,
  staticFileHandler,
};
