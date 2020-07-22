const { workerData, parentPort } = require('worker_threads');
const path = require('path');
const webpack = require('webpack');
const { requireAsync } = require('../utils/file');
const { WEBPACK_MODE, BUILD_MODE, WEBPACK_MESSAGE_TYPE } = require('../enum');

const getPath = (name) => {
  return path.resolve(__dirname, `../../apps/${name}/webpack.config`);
};

const { name, mode } = workerData;

requireAsync(getPath(name)).then((config) => {
  config.mode = mode === BUILD_MODE.BUILD ? WEBPACK_MODE.PROD : WEBPACK_MODE.DEV;
  config.devtool = mode === BUILD_MODE.BUILD ? undefined : 'cheap-module-eval-source-map';
  const compiler = webpack(config);

  const func = (percentage) => {
    parentPort.postMessage({
      type: WEBPACK_MESSAGE_TYPE.HANDLER,
      name,
      percentage,
    });
  };

  const plugin = new webpack.ProgressPlugin(func);
  plugin.apply(compiler);

  const handler = (err, stats) => {
    const error = stats.hasErrors() ? stats.toString() : err;
    parentPort.postMessage({
      type: WEBPACK_MESSAGE_TYPE.DONE,
      err: error,
      name,
    });
  };

  if (mode === BUILD_MODE.BUILD) {
    compiler.run(handler);
  } else {
    compiler.watch({
      aggregateTimeout: 300,
    }, handler);
  }

}).catch((err) => {
  parentPort.postMessage({
    type: WEBPACK_MESSAGE_TYPE.DONE,
    err,
    name,
  });
});

