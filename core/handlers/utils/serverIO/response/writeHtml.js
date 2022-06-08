/** Read and send html files */
const fs = require('fs');
const cheerio = require('cheerio');
const { MODE } = require('@/utils/enum');
const config = require('@/utils/config');
const { CONTENT_TYPE_MAPPING } = require('@/core/enum');

const namespace = 'html';
const writeHtml = (res) => {
  res[namespace] = function (appFolder, head = {}) {
    let filePath = `${config.WEB_BASE_FOLDER}/${appFolder}/index.html`;

    fs.readFile(filePath, 'utf-8', (err, data) => {
      const
        $ = cheerio.load(data),
        headTags = $('head').html().trim();

      const external = $('external');
      let externalStyle = external && external.find('css').html();
      externalStyle = externalStyle ? externalStyle.trim() : '';
      let externaljs = external && external.find('js').html();
      externaljs = externaljs ? externaljs.trim() : '';

      $('body').find('external').remove();
      const bodyTags = $('body').html().trim();

      const template = `
<!DOCTYPE html>
<html lang="en">

<head>
  <base href="/${appFolder}/">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" type="image/png" href="./favicon.png" />
  ${config.MODE === MODE.PROD ? externalStyle : ''}
  <link rel="stylesheet" href="./dist/main.css" media="all">
  ${headTags}
</head>

<body>
  ${bodyTags}
  ${config.MODE === MODE.PROD ? externaljs : ''}
  <script src="./dist/main.js"></script>
</body>

</html>
      `.trim();

      this.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING['html'], 'Content-Length': Buffer.byteLength(template, 'utf-8'), ...head });
      this.write(template);
      this.end();
    });
  };
}

module.exports = writeHtml;
