const getCurrentLine = require('./getCurrentLine');
const getErrorTitle = require('./getErrorTitle');
const getWarningTitle = require('./getWarningTitle');
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
    // write all warnings of apps to console
    if (dataMap[key].warning) {
      if (dataMap[key].error) process.stdout.write('\n');
      process.stdout.write(getWarningTitle(key));
      console.warn(dataMap[key].warning);
      process.stdout.write('\n');
    }
  });

  return hasError;
};

module.exports = handleErrors;
