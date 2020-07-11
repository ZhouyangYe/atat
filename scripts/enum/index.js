const COMMANDS = {
  BUILD: 'build',
  DEV: 'dev',
};

const WEBPACK_MODE = {
  DEV: 'development',
  PROD: 'production',
};

const BUILD_MODE = {
  DEV: 'dev',
  BUILD: 'build',
};

const INVOKE_MODE = {
  RUN: 'run',
  WATCH: 'watch',
};

const WEBPACK_MESSAGE_TYPE = {
  HANDLER: 'handler',
  DONE: 'done',
};

const appList = ['algorithms', 'hahaha', 'home', 'intro', 'notFound', 'pingpong'];
const common = 'common';

module.exports = {
  COMMANDS,
  WEBPACK_MODE,
  BUILD_MODE,
  INVOKE_MODE,
  WEBPACK_MESSAGE_TYPE,
  appList,
  common,
};
