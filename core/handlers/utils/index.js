const { get, post, mainHandler, decorateIO } = require('./mainHandler');
const staticFileHandler = require('./staticFileHandler');
const bodyParser = require('./bodyParser');

module.exports = {
  get,
  post,
  mainHandler,
  decorateIO,
  staticFileHandler,
  bodyParser,
};
