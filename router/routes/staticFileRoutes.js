const staticFileHandler = require('../../core/handlers/staticFileHandler');

const staticFileRoutes = {
  match: /(\.js|\.css|\.jpeg|\.jpg|\.png|\.gif|\.html|\.map|\.otf|\.woff|\.ttf|\.mp4|\.svg|\.ico)$/,
  handler: staticFileHandler,
};

module.exports = { staticFileRoutes };
