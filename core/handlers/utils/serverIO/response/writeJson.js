/** Write json files */
const { CONTENT_TYPE_MAPPING } = require('@/core/enum');

const namespace = 'json';
const writeJson = (res) => {
  res[namespace] = function(data) {
    const text = JSON.stringify(data);
    const length = Buffer.byteLength(text, 'utf-8');
    this.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING['json'], 'Content-Length': length });
    this.write(text);
    this.end();
  };
};

module.exports = writeJson;
