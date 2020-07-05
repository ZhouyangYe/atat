const chalk = require('chalk');
const figlet = require('figlet');

const getCustomText = (text, font, style) => {
  let result = figlet.textSync(text, style, (err, data) => {
    if (err) {
      console.log(`Can't create text!`);
      console.dir(err);
      return;
    }
    console.log(data);
  });

  font.forEach((item) => {
    result = chalk[item](result);
  });

  return result;
};

module.exports = {
  getCustomText,
};
