const readline = require('readline');
const clear = require('clear');
const chalk = require('chalk');
const { getCustomText } = require('./text');

const clearScreen = () => {
  const text = getCustomText('Hello BT!', ['blueBright'], {
    font: 'Standard',
    horizontalLayout: 'full',
  });
  clear();
  console.log(text);
};

const modifyConsole = () => {
  const { error, info, warn } = console;
  console.error = (text) => {
    error(chalk.red(text));
  };

  console.info = (text) => {
    info(chalk.green(text));
  }

  console.warn = (text) => {
    warn(chalk.yellow(text));
  }
};

const writeOnLine = (stream, line, text) => {
  readline.cursorTo(stream, 0, line);
  stream.write(text);
};

module.exports = {
  clearScreen,
  modifyConsole,
  writeOnLine,
};
