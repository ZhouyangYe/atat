const { get, post, mainHandler, decorateIO } = require('./mainHandler');
const staticFileHandler = require('./staticFileHandler');
const bodyParser = require('./bodyParser');
const encrypt = require('./encryption');

module.exports = {
  get,
  post,
  mainHandler,
  decorateIO,
  staticFileHandler,
  bodyParser,
  encrypt,
};
