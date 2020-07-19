const chalk = require('chalk');
const figlet = require('figlet');

const getCustomText = (text, font, style) => {
  let result = figlet.textSync(text, style, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  font.forEach((item) => {
    result = chalk[item](result);
  });

  return result;
};

module.exports = {
  getCustomText,
};
