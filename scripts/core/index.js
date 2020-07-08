const webpack = require('webpack');
const chalk = require('chalk');
const log = require('single-line-log').stdout;

const { MODE, common, appList } = require('../enum');
const { clearScreen } = require('../utils');

const pointer = ['\\', '|', '/', '-'];

const getPath = (name) => {
  return `../../apps/${name}/webpack.config`;
};

const buildAll = () => {
  const commonConfig = require(getPath(common));
  commonConfig.mode = MODE.PROD;
  const compiler = webpack(commonConfig);

  const handler = (percentage) => {
    const total = 100;
    const division = 5;
    const current = percentage * total;
    const bars = 20; // total / division
    const progress = (current / division).toFixed(0);

    let progressBar = `Building [${chalk.cyan(common)}]: `;
    const green = chalk.bgGreen(' ');
    const white = chalk.bgWhite(' ');
    for (let i = 0; i < bars; i++) {
      if (i < progress) {
        progressBar = `${progressBar}${green}`;
      } else {
        progressBar = `${progressBar}${white}`;
      }
    }
    log(`${progressBar} ${current.toFixed(2)}%`);
  };

  const plugin = new webpack.ProgressPlugin(handler);
  plugin.apply(compiler);

  compiler.run((err) => {
    if (err) {
      console.error(err);
    }
  });

  clearScreen();
};

module.exports = {
  buildAll,
};
