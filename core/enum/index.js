const CONTENT_TYPE_MAPPING = {
  'css': 'text/css',
  'js': 'text/javascript',
  'html': 'text/html',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'mp4': 'video/mpeg4',
  'mp3': 'audio/mpeg',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'map': 'application/json',
  'json': 'application/json',
  'fbx': 'application/octet-stream',
  'ttf': 'font/ttf',
};

const METHOD_TYPE = {
  GET: 'get',
  POST: 'post'
};

const METHOD_MODE = {
  PAGE: 'page',
  API: 'api',
};

const ROLE = {
  ADMIN: 'admin',
  VISITOR: 'visitor',
};

const IMAGE_TYPE = {
  PROFILE: 'profile',
  ALBUM: 'album',
  VIDEO: 'video',
};

module.exports = {
  CONTENT_TYPE_MAPPING,
  METHOD_TYPE,
  METHOD_MODE,
  IMAGE_TYPE,
  ROLE,
};
