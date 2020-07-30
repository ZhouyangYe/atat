const getCurrentLine = require('./getCurrentLine');
const getErrorTitle = require('./getErrorTitle');
const { writeOnLine } = require('../../utils');

const handleErrors = (apps, dataMap, line) => {
  let hasError = false;

  // move cursor to target line
  writeOnLine(process.stdout, getCurrentLine(line), '');
  apps.forEach(key => {
    // write all errors of apps to console
    if (dataMap[key].error) {
      hasError = true;
      process.stdout.write(getErrorTitle(key));
      console.error(dataMap[key].error);
      process.stdout.write('\n');
    }
  });

  return hasError;
};

module.exports = handleErrors;
