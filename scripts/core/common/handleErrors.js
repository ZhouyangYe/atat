const getCurrentLine = require('./getCurrentLine');
const getErrorTitle = require('./getErrorTitle');
const { writeOnLine } = require('../../utils');

const handleErrors = (apps, dataMap, line) => {
  let hasError = false;

  writeOnLine(process.stdout, getCurrentLine(line), '');
  apps.forEach(key => {
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
