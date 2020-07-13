const chalk = require('chalk');
const getCurrentLine = require('./getCurrentLine');
const { writeOnLine } = require('../../utils');

/**
 * @description Draw progress bar on terminal
 * @param {string}name Progress bar name
 * @param {string}icon Progress bar icon  
 * @param {{percentage:number,line:number}}meta Metadata  
 */
const drawProgress = (name, icon, meta) => {
  const { percentage = 0 } = meta;
  const total = 100;
  const division = 5;
  const current = percentage * total;
  const bars = 20; // total / division
  const progress = (current / division).toFixed(0);
  const currentLine = getCurrentLine(meta.line);

  let progressBar = `Building [${chalk.cyan(name)}]: `;
  const green = chalk.bgGreen(' ');
  const white = chalk.bgWhite(' ');
  for (let i = 0; i < bars; i++) {
    if (i < progress) {
      progressBar = `${progressBar}${green}`;
    } else {
      progressBar = `${progressBar}${white}`;
    }
  }
  writeOnLine(process.stdout, currentLine, `${icon} ${progressBar} ${current.toFixed(2)}%      `);
};

module.exports = drawProgress;
