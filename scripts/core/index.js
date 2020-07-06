const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const { MODE, common, appList } = require('../enum');

const getPath = (name) => {
  return `../../apps/${name}/webpack.config`;
};

const buildAll = () => {
  const commonConfig = require(getPath(common));
  commonConfig.mode = MODE.PROD;
  const compiler = webpack(commonConfig);

  compiler.apply(new ProgressPlugin((percentage) => {
    console.log(percentage);
    // process.stdout.write(`\r ${percentage}`);
  }));

  compiler.run((err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = {
  buildAll,
};
