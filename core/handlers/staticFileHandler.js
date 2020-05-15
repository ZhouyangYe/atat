const fs = require('fs');

const { BASE_FILE, CONTENT_TYPE_MAPPING } = require('../enum');

module.exports = (req, res) => {
  let filePath = '';
  if (/node_modules/.test(req.url)) {
    const temp = req.url.split('/');
    temp.splice(0, 2);
    filePath = temp.join('/');
  } else {
    filePath = `${BASE_FILE}${req.url}`;
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
