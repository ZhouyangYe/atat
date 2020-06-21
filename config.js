const fs = require('fs');
const path = require('path');

const config = {};

fs.readFileSync(path.resolve(__dirname, './server.config'), 'utf-8').split(/\r?\n/).forEach((line) => {
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
