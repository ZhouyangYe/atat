const { get, post, mainHandler } = require('./mainHandler');
const { deliverHtmlFile } = require('./deliverHtmlFile');
const staticFileHandler = require('./staticFileHandler');

module.exports = {
  get,
  post,
  deliverHtmlFile,
  mainHandler,
  staticFileHandler,
};
