const fs = require('fs');

const { BASE_FILE, CONTENT_TYPE_MAPPING } = require('../enum');

const pingpongHandler = (req, res) => {
  const filePath = `${BASE_FILE}/pingpong/index.html`;
  fs.readFile(filePath, function (err, data) {
      res.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING['html'], 'Content-Length': data.length });
      res.write(data);
      res.end();
  });
};

module.exports = pingpongHandler;
