const fs = require('fs');
const path = require('path');

const getBaseDirectory = () => {
  return path.basename(process.cwd());
};

const isFileExist = (filePath) => {
  return fs.existsSync(filePath);
};

module.exports = {
  getBaseDirectory,
  isFileExist,
};
