/**
 * Create log tool for dev
 */
const config = require('@/config');
const { MODE } = require('./enum');

const logger = {
  info: () => { },
  warn: () => { },
  error: () => { },
};

if (config.MODE === MODE.DEV) {
  const reset = '\x1b[0m';
  // console.info
  const dataInfo = {
    icon: '✎',
    blueBg: '\x1b[44m',
    blueFg: '\x1b[36m',
    whiteFg: '\x1b[37m',
  };
  logger.info = (...args) => {
    console.info(dataInfo.blueBg + dataInfo.whiteFg, dataInfo.icon, reset, dataInfo.blueFg, ...args, reset); // eslint-disable-line no-console
  };

  // console.warn
  const dataWarn = {
    icon: '❗',

    yellowBg: '\x1b[43m',
    yellowFg: '\x1b[33m',
    whiteFg: '\x1b[37m',
  };
  logger.warn = (...args) => {
    console.warn(dataWarn.yellowBg + dataWarn.whiteFg, dataWarn.icon, reset, dataWarn.yellowFg, ...args, reset); // eslint-disable-line no-console
  };

  // console.error
  const dataError = {
    icon: '✘',

    redBg: '\x1b[41m',
    redFg: '\x1b[31m',
    whiteFg: '\x1b[37m',
  };
  logger.error = (...args) => {
    console.error(dataError.redBg + dataError.whiteFg, dataError.icon, reset, dataError.redFg, ...args, reset); // eslint-disable-line no-console
  };
}

module.exports = logger;
