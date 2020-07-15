const fs = require('fs');
const config = require('../../../config');

const { CONTENT_TYPE_MAPPING } = require('../../enum');
const { WEB_BASE_FOLDER } = config;

module.exports = (req, res) => {
  let filePath = '';
  if (/\/resources\//.test(req.url) || /node_modules/.test(req.url)) { // Get external libraries when there is "node_modules" or "/resources/" in the path
    const temp = req.url.split('/');
    temp.splice(0, 2);
    filePath = temp.join('/');
  } else if (/yzy_common/.test(req.url)) { // Get common functions when there is "yzy_common" in the path
    const temp = req.url.split('/');
    temp.splice(0, 3);
    filePath = `${WEB_BASE_FOLDER}/common/${temp.join('/')}`;
  } else {
    filePath = `${WEB_BASE_FOLDER}${req.url}`;
  }

  fs.readFile(filePath, function (err, data) {
    if (!data) {
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
