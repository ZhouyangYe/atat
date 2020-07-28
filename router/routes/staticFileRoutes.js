const { staticFileHandler } = require('../../core/handlers');

const staticFileRoutes = {
  match: /(\.js|\.ts|\.css|\.jpeg|\.jpg|\.png|\.gif|\.html|\.map|\.otf|\.woff|\.ttf|\.mp4|\.svg|\.ico)$/,
  handler: staticFileHandler,
};

module.exports = { staticFileRoutes };
