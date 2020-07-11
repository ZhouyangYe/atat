const fs = require('fs');
const path = require('path');

const getBaseDirectory = () => {
  return path.basename(process.cwd());
};

const isFileExist = (filePath) => {
  return fs.existsSync(filePath);
};

const requireAsync = (filePath) => {
  return new Promise((res, rej) => {
    fs.readFile(`${filePath}.js`, 'utf-8', (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      module._compile(data, filePath);
      res(require(filePath));
    });
  });
};

module.exports = {
  getBaseDirectory,
  isFileExist,
  requireAsync,
};
