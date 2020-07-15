const cliCursor = require('cli-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { common, appList, BUILD_MODE, pointers, successIcon, failIcon, errorMessage } = require('../enum');
const buildModule = require('./buildModule');
const syncCommon = require('./syncCommon');
const { writeOnLine, startTimer } = require('../utils');
const { getCurrentLine, drawProgress, getErrorTitle, handleErrors } = require('./common');

const statusMetaMap = {
  [common]: {
    /** Current line of the progress bar */
    line: 0,
    /** Indicates if the compiling is done for the app */
    done: false,
    /** Stop progress bar timer */
    cancelTimer: null,
    /** The current percentage */
    percentage: 0,
    /** Keep tracking for compilation error of each app */
    error: null,
  },
};

appList.forEach((app, index) => {
  statusMetaMap[app] = {
    line: index + 2,
    done: false,
  };
});

const handler = (name, percentage) => {
  statusMetaMap[name].percentage = percentage;
};

const start = (name) => {
  let index = 0;
  statusMetaMap[name].cancelTimer = startTimer(() => {
    index = index % 4;
    drawProgress(name, pointers[index], statusMetaMap[name]);
    index++;
  });
};

const done = (name, err) => {
  statusMetaMap[name].done = true;
  statusMetaMap[name].cancelTimer();
  const icon = err ? failIcon : successIcon;

  drawProgress(name, icon, statusMetaMap[name]);

  if (name === common && !!err) {
    process.stdout.write('\n\n');
    process.stdout.write(getErrorTitle(common));
    console.error(err);
    process.stdout.write(`\n${errorMessage}`);
    // Show the cursor when everything is done
    cliCursor.show();
    return;
  }

  if (err) {
    statusMetaMap[name].error = err;
  }

  // If module 'common' has done building, sync it to node_modules and then start building other modules,
  // because all modules are dependent on 'common'.
  if (name === common && !err) {
    const currentLine = getCurrentLine(statusMetaMap[common].line + 1);
    let index = 0;
    const cancelTimer = startTimer(() => {
      index = index % 4;
      const dots = new Array(3).fill(' ');
      for (let i = 0; i < index; i++) {
        dots[i] = '.';
      }
      writeOnLine(process.stdout, currentLine, `${pointers[index]} Synchronizing [${chalk.cyan(common)}]${dots.join('')}`);
      index++;
    });
    syncCommon().then(() => {
      cancelTimer();
      writeOnLine(process.stdout, currentLine, `${successIcon} Synchronizing [${chalk.cyan(common)}]: done!\n`);

      // if 'common' was built successfully, start building other modules
      appList.forEach((app) => {
        buildModule(app, BUILD_MODE.BUILD, handler, start, done);
      });
    }).catch((err) => {
      cancelTimer();
      writeOnLine(process.stdout, currentLine, `${failIcon} Synchronizing [${chalk.cyan(common)}]: failed!\n\n`);
      process.stdout.write(getErrorTitle(common));
      console.error(err);
      process.stdout.write(`${errorMessage}`);
    });
  }

  // All compilations are done
  if (appList.findIndex(module => statusMetaMap[module].done === false) === -1) {
    const lastApp = appList[appList.length - 1];
    const hasError = handleErrors(appList, statusMetaMap, statusMetaMap[lastApp].line + 1);

    const text = hasError ? errorMessage : `${chalk.yellow(emoji.get('v'))}  ${chalk.green('All done!')}\n`;
    process.stdout.write(text);
    // Show the cursor when everything is done
    cliCursor.show();
  }
};

const buildAll = () => {
  // Hide the cursor before doing any animations, in case seeing the cursor moving back and forth all the time
  cliCursor.hide();
  buildModule(common, BUILD_MODE.BUILD, handler, start, done);
};

module.exports = buildAll;
