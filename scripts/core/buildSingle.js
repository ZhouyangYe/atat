const cliCursor = require('cli-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { errorMessage, pointers, successIcon, failIcon } = require('../enum');
const { drawProgress } = require('./common');
const { startTimer, clearScreen } = require('../utils');
const buildModule = require('./buildModule');

const metaData = {
  /** Current line of the progress bar */
  line: 0,
  /** Stop progress bar timer */
  cancelTimer: null,
  /** The current percentage */
  percentage: 0,
};

const handler = (name, percentage) => {
  metaData.percentage = percentage;
};

const start = (name) => {
  clearScreen();
  let index = 0;
  if (metaData.cancelTimer) metaData.cancelTimer();
  metaData.cancelTimer = startTimer(() => {
    index = index % 4;
    drawProgress(name, pointers[index], metaData);
    index++;
  });
};

const done = (name, err) => {
  metaData.cancelTimer();
  const icon = err ? failIcon : successIcon;

  drawProgress(name, icon, metaData);
  process.stdout.write('\n\n');

  if (err) {
    console.error(err);
    process.stdout.write(`\n${errorMessage}`);

    cliCursor.show();
    return;
  }

  process.stdout.write(`${chalk.yellow(emoji.get('v'))}  ${chalk.green('Done!')}\n`);
  cliCursor.show();
};

const buildSingle = (name, mode) => {
  cliCursor.hide();
  buildModule(name, mode, handler, start, done);
};

module.exports = buildSingle;
