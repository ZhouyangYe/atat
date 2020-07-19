/** Write json files */
const { CONTENT_TYPE_MAPPING } = require('@/core/enum');

const namespace = 'json';
const writeJson = (res) => {
  res[namespace] = (data) => {
    const text = JSON.stringify(data);
    const length = Buffer.byteLength(text, 'utf-8');
    res.writeHead(200, { 'Content-Type': CONTENT_TYPE_MAPPING['json'], 'Content-Length': length });
    res.write(text);
    res.end();
  };
};

module.exports = writeJson;
