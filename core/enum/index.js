const CONTENT_TYPE_MAPPING = {
  'css': 'text/css',
  'js': 'text/javascript',
  'html': 'text/html',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'mp4': 'video/mpeg4',
  'svg': 'text/xml',
  'ico': 'image/x-icon',
  'map': 'application/json',
  'json': 'application/json'
};

const METHOD_TYPE = {
  GET: 'get',
  POST: 'post'
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
  IMAGE_TYPE,
  ROLE,
};
