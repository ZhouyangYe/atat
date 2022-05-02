const cliCursor = require('cli-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { errorMessage, pointers, successIcon, failIcon } = require('../enum');
const { drawProgress, handleErrors } = require('./common');
const { startTimer, clearScreen } = require('../utils');
const buildModule = require('./buildModule');

const metaDatas = {
  lastLine: 0,
  keys: [],
};

const handler = (name, percentage) => {
  metaDatas[name].percentage = percentage;
};

const start = (name) => {
  cliCursor.hide();
  clearScreen();
  // Redraw all progress bars after screen is cleared
  metaDatas.keys.forEach((key) => {
    const icon = metaDatas[key].icon;
    drawProgress(key, icon, metaDatas[key]);
  });

  metaDatas[name].done = false;
  metaDatas[name].error = null;
  let index = 0;
  if (metaDatas[name].cancelTimer) metaDatas[name].cancelTimer();
  metaDatas[name].cancelTimer = startTimer(() => {
    index = index % 4;
    const icon = pointers[index];
    metaDatas[name].icon = icon;
    drawProgress(name, icon, metaDatas[name]);
    index++;
  });
};

const done = (name, err) => {
  metaDatas[name].done = true;
  metaDatas[name].cancelTimer();
  metaDatas[name].error = err;

  const icon = err ? failIcon : successIcon;
  metaDatas[name].icon = icon;
  drawProgress(name, icon, metaDatas[name]);
  process.stdout.write('\n\n');

  // All compilations are done
  if (metaDatas.keys.findIndex(key => metaDatas[key].done === false) === -1) {
    const hasError = handleErrors(metaDatas.keys, metaDatas, metaDatas.lastLine + 1);

    if (hasError) {
      process.stdout.write(`${errorMessage}`);
      cliCursor.show();
      return;
    }
  }

  process.stdout.write(`${chalk.yellow(emoji.get('v'))}  ${chalk.green('Done!')}\n`);
  cliCursor.show();
};

const buildSome = (apps, mode) => {
  cliCursor.hide();
  metaDatas.lastLine = apps.length - 1;
  apps.forEach((app, index) => {
    const metaData = {
      /** Current line of the progress bar */
      line: index,
      /** Which icon the progress bar is using */
      icon: '',
      /** Indicates if the compiling is done for the app */
      done: false,
      /** Stop progress bar timer */
      cancelTimer: null,
      /** The current percentage */
      percentage: 0,
      /** Keep tracking for compilation error of each app */
      error: null,
    };

    metaDatas[app] = metaData;
    metaDatas.keys.push(app);

    setTimeout(() => {
      buildModule(app, mode, handler, start, done);
    }, 0);
  });
};

module.exports = buildSome;
