const cliCursor = require('cli-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');
const { common, appList, BUILD_MODE } = require('../enum');
const buildModule = require('./buildModule');
const syncCommon = require('./syncCommon');
const { writeOnLine } = require('../utils');

const pointers = ['\\', '|', '/', '-'];

const initLine = 6;
const delta = 2; // controls line space

const successIcon = chalk.green(emoji.get('heart'));
const failIcon = chalk.red(emoji.get('x'));

const statusMetaMap = {
  [common]: {
    line: 0,
    done: false,
  },
};

appList.forEach((app, index) => {
  statusMetaMap[app] = {
    line: index + 2,
    done: false,
  };
});

const startTimer = (cb) => {
  const timer = setInterval(() => {
    cb();
  }, 125);

  return () => {
    clearInterval(timer);
  };
};

const getCurrentLine = (line) => {
  return line * delta + initLine;
};

const handler = (name, percentage) => {
  statusMetaMap[name].percentage = percentage;
};

const drawProgress = (name, pointer) => {
  const { percentage = 0 } = statusMetaMap[name];
  const total = 100;
  const division = 5;
  const current = percentage * total;
  const bars = 20; // total / division
  const progress = (current / division).toFixed(0);
  const currentLine = getCurrentLine(statusMetaMap[name].line);

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
  writeOnLine(process.stdout, currentLine, `${pointer} ${progressBar} ${current.toFixed(2)}%`);
};

const start = (name) => {
  let index = 0;
  statusMetaMap[name].cancelTimer = startTimer(() => {
    index = index % 4;
    drawProgress(name, pointers[index]);
    index++;
  });
};

const done = (name, err) => {
  statusMetaMap[name].done = true;
  statusMetaMap[name].cancelTimer();
  const icon = err ? failIcon : successIcon;
  const errorMessage = `${chalk.blueBright('Something is wrong, please check the info above')} ${chalk.cyan(emoji.get('point_up'))}\n`;
  const getErrorTitle = (title) => (`<${chalk.yellow('Error')}> ${chalk.cyan(title)} ------------------------>\n\n`);

  drawProgress(name, icon);

  if (name === common && !!err) {
    process.stdout.write('\n\n');
    process.stdout.write(getErrorTitle(common));
    console.error(err);
    process.stdout.write(`\n${errorMessage}`);
    cliCursor.show();
    return;
  }

  if (err) {
    statusMetaMap[name].error = err;
  }

  // if module 'common' has done building, sync it to node_modules and then start building other modules,
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

  if (appList.findIndex(module => statusMetaMap[module].done === false) === -1) {
    const lastApp = appList[appList.length - 1];
    const currentLine = getCurrentLine(statusMetaMap[lastApp].line + 1);
    writeOnLine(process.stdout, currentLine, '');
    let hasError = false;

    appList.forEach((app) => {
      const { error } = statusMetaMap[app];
      if (error) {
        hasError = true;
        process.stdout.write(getErrorTitle(app));
        console.error(error);
        process.stdout.write('\n');
      }
    });

    const text = hasError ? errorMessage : `${chalk.yellow(emoji.get('v'))}  ${chalk.green('All done!')}\n`;
    process.stdout.write(text);
    cliCursor.show();
  }
};

const buildAll = () => {
  cliCursor.hide();
  buildModule(common, BUILD_MODE.BUILD, handler, start, done);
};

module.exports = {
  buildAll,
};
