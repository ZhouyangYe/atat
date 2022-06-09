const fs = require('fs');
const config = require('@/utils/config');

const { CONTENT_TYPE_MAPPING } = require('../../enum');
const { WEB_BASE_FOLDER, RESOURCES_BASE_FOLDER } = config;

module.exports = (req, res) => {
  let filePath = '';
  const url = req.path;
  const ext = url.split('.').pop();

  if (/@node_modules\//.test(url)) { // serve files in node_modules
    filePath = `node_modules/${url.split('@node_modules/').slice(1)}`;
  } else if (/@resources\//.test(url)) { // serve files in resources
    filePath = `${RESOURCES_BASE_FOLDER}/${url.split('@resources/').slice(1)}`;
  } else { // serve files in apps
    filePath = `${WEB_BASE_FOLDER}${url}`;
  }

  fs.readFile(filePath, function (err, data) {
    if (!!err || !data) {
      res.writeHead(404);
      res.write('Not Found!');
      res.end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': CONTENT_TYPE_MAPPING[ext],
      'Content-Length': data.length,
      'Cache-Control': 'max-age=604800',
    });
    res.write(data);
    res.end();
  });
};
