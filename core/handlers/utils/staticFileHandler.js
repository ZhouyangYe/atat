const fs = require('fs');
const config = require('../../../config');

const { CONTENT_TYPE_MAPPING } = require('../../enum');
const { WEB_BASE_FOLDER } = config;

module.exports = (req, res) => {
  let filePath = '';
  // When there is a @/ sign, means it's absolute path
  if (/@\//.test(req.url)) {
    filePath = req.url.split('@/').slice(1).join('@/');
  } else {
    filePath = `${WEB_BASE_FOLDER}${req.url}`;
  }

  fs.readFile(filePath, function (err, data) {
    if (!!err || !data) {
      res.writeHead(404);
      res.write('Not Found!');
      res.end();
      return;
    }

    const ext = req.url.split('.').pop();
    res.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING[ext], 'Content-Length': data.length });
    res.write(data);
    res.end();
  });
};
