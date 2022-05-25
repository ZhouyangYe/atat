const fs = require('fs');
const path = require('path');

const config = {
  MODE: undefined,
  WEB_PORT: undefined,
  MAJIANG_PORT: undefined,
  PINGPONG_PORT: undefined,
  WEB_BASE_FOLDER: undefined,
  RESOURCES_BASE_FOLDER: undefined,
  API_BASE_URL: undefined,
  HOSTNAME: undefined,
  USER: undefined,
  PASSWORD: undefined,
  DATABASE: undefined,
  LIMIT: undefined,
};

fs.readFileSync(path.resolve(__dirname, '../server.config'), 'utf-8').split(/\r?\n/).forEach((line) => {
  readLine(line);
});

function readLine(line) {
  if (line.startsWith('//') || line === '') {
    return;
  }
  const pair = line.split('=');
  if (pair.length === 1) {
    return;
  }
  config[pair[0]] = pair[1];
}

module.exports = config;
