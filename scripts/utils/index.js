const readline = require('readline');
const clear = require('clear');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { getCustomText } = require('./text');

/**
 * Clear the screen and draw logo
 */
const clearScreen = () => {
  const text = getCustomText('Hello BT!', ['blueBright'], {
    font: 'Standard',
    horizontalLayout: 'full',
  });
  clear();
  console.log(text);
};

/**
 * Overload console functions
 */
const modifyConsole = () => {
  const { error, info, warn } = console;
  console.error = (text, withIcon = false) => {
    const content = withIcon ? `${emoji.get('x')} ${text}` : text;
    error(chalk.red(content));
  };

  console.info = (text, withIcon = false) => {
    const content = withIcon ? `${emoji.get('information_source')} ${text}` : text;
    info(chalk.green(content));
  }

  console.warn = (text, withIcon = false) => {
    const content = withIcon ? `${emoji.get('exclamation')} ${text}` : text;
    warn(chalk.yellow(content));
  }
};

/**
 * @description Write on specific line
 * @param {Object} stream Output stream
 * @param {number} line Target line
 * @param {string} text Content
 */
const writeOnLine = (stream, line, text) => {
  readline.cursorTo(stream, 0, line);
  stream.write(text);
};

/**
 * @description Creates a timer and returns the cancellation function
 * @param {()=>void} cb Callback function
 * @param {number} interval Time gaps between each callback
 */
const startTimer = (cb, interval = 125) => {
  const timer = setInterval(() => {
    cb();
  }, interval);

  return () => {
    clearInterval(timer);
  };
};

module.exports = {
  clearScreen,
  modifyConsole,
  writeOnLine,
  startTimer,
};
