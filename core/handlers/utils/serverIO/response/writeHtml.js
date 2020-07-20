/** Read and send html files */
const fs = require('fs');
const config = require('@/config');
const { CONTENT_TYPE_MAPPING } = require('@/core/enum');

const namespace = 'html';
const writeHtml = (res) => {
  res[namespace] = (appFolder) => {
    let filePath = `${config.WEB_BASE_FOLDER}/${appFolder}/index.html`;
    fs.readFile(filePath, function (err, data) {
      res.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING['html'], 'Content-Length': data.length });
      res.write(data);
      res.end();
    });
  };
}

module.exports = writeHtml;
