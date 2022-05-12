const { get, post, mainHandler, decorateIO, use } = require('./mainHandler');
const staticFileHandler = require('./staticFileHandler');
const bodyParser = require('./bodyParser');
const session = require('./session');

module.exports = {
  use,
  get,
  post,
  mainHandler,
  decorateIO,
  staticFileHandler,
  bodyParser,
  session,
};
