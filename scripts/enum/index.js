const chalk = require('chalk');
const emoji = require('node-emoji');

const COMMANDS = {
  BUILD: 'build',
  DEV: 'dev',
  CLEAN: 'clean',
  PASSWORD: 'password',
  FONT: 'font',
};

const WEBPACK_MODE = {
  DEV: 'development',
  PROD: 'production',
};

const BUILD_MODE = {
  DEV: 'dev',
  BUILD: 'build',
};

const WEBPACK_MESSAGE_TYPE = {
  HANDLER: 'handler',
  DONE: 'done',
};

const pointers = ['\\', '|', '/', '-'];

const successIcon = chalk.green(emoji.get('heart'));
const failIcon = chalk.red(emoji.get('x'));
const errorMessage = `${chalk.blueBright('Something is wrong, please check the info above')} ${chalk.cyan(emoji.get('point_up'))}\n`;

/** Terminal start line */
const initLine = 6;
/** Line space */
const delta = 2;

const appList = ['stories', 'home', 'intro', 'test', 'majiang', 'pingpong', 'admin'];
const common = 'common';
const node_modules = 'modules';

module.exports = {
  COMMANDS,
  WEBPACK_MODE,
  BUILD_MODE,
  WEBPACK_MESSAGE_TYPE,
  appList,
  common,
  node_modules,
  initLine,
  delta,
  pointers,
  successIcon,
  failIcon,
  errorMessage,
};
