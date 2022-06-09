const path = require('path');
const { Worker } = require('worker_threads');
const cliCursor = require('cli-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { getCurrentLine, handleErrors } = require('./common');
const { writeOnLine, startTimer } = require('../utils');
const { pointers, successIcon, failIcon, errorMessage } = require('../enum');

/**
 * @description Remove build dist folder from apps
 * @param {string[]} apps Apps to be cleaned
 */
const cleanApps = (apps) => {
  cliCursor.hide();
  const cleanMap = {
    lastLine: apps.length - 1,
  };

  apps.forEach((app, index) => {
    cleanMap[app] = {
      line: index,
      done: false,
    };
  });

  apps.map((app) => {
    // Draw spinning icons
    const currentLine = getCurrentLine(cleanMap[app].line);
    let index = 0;
    cleanMap[app].cancelTimer = startTimer(() => {
      index = index % 4;
      const dots = new Array(3).fill(' ');
      for (let i = 0; i < index; i++) {
        dots[i] = '.';
      }
      writeOnLine(process.stdout, currentLine, `${pointers[index]} cleaning [${chalk.cyan(app)}]${dots.join('')}`);
      index++;
    });

    return new Promise((res, rej) => {
      const worker = new Worker(path.resolve(__dirname, './cleanWorker.js'), {
        workerData: {
          app,
        },
      })

      worker.on('message', (data) => {
        const { err, app: name } = data;

        if (err) {
          rej({ err, app: name });
          return;
        }

        res(name);
      });
    });
  }).forEach(promise => {
    promise.then((name) => {
      cleanMap[name].done = true;
      cleanMap[name].cancelTimer();
      const currentLine = getCurrentLine(cleanMap[name].line);
      // update status info for specific app progress
      writeOnLine(process.stdout, currentLine, `${successIcon} cleaning [${chalk.cyan(name)}]: done!\n`);

      // all done
      if (apps.findIndex(app => cleanMap[app].done === false) === -1) {
        if (handleErrors(apps, cleanMap, cleanMap.lastLine + 1)) {
          // write end line error message
          process.stdout.write(`${errorMessage}`);
          cliCursor.show();
          return;
        }

        // write end line success message
        process.stdout.write(`${chalk.yellow(emoji.get('v'))}  ${chalk.green('All done!')}\n`);
        cliCursor.show();
      }
    }).catch(({ err, app }) => {
      cleanMap[app].done = true;
      cleanMap[app].error = err;
      cleanMap[app].cancelTimer();
      const currentLine = getCurrentLine(cleanMap[app].line);
      // update status info for specific app progress
      writeOnLine(process.stdout, currentLine, `${failIcon} cleaning [${chalk.cyan(app)}]: failed!\n`);

      // all done
      if (apps.findIndex(name => cleanMap[name].done === false) === -1) {
        handleErrors(apps, cleanMap, cleanMap.lastLine + 1);
      }
    });
  });
};

module.exports = cleanApps;
