const { workerData, parentPort } = require('worker_threads');
const path = require('path');
const webpack = require('webpack');
const { requireAsync } = require('../utils/file');
const { BUILD_MODE, WEBPACK_MESSAGE_TYPE } = require('../enum');
const { buildDevConfig, buildProdConfig } = require('./buildWebpackConfig');

const getPath = (name) => {
  return path.resolve(__dirname, `../../apps/${name}/webpack.config`);
};

const { name, mode } = workerData;

requireAsync(getPath(name)).then((config = {}) => {
  config = mode === BUILD_MODE.BUILD ?
    buildProdConfig(config, name) : buildDevConfig(config, name);

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
    const info = stats && stats.toJson();
    const error = stats && stats.hasErrors() ? info.errors.map((e) => {
      return `${e.moduleName}\n${e.message}`;
    }).join('\n\n') : err;
    const warning = stats && stats.hasWarnings() ? info.warnings.map((w) => {
      return `${w.stack}\n${w.message}`;
    }).join('\n\n') : '';

    // webpack 5 bug, handler is called before ProgressPlugin ends.
    setTimeout(() => {
      parentPort.postMessage({
        type: WEBPACK_MESSAGE_TYPE.DONE,
        err: error,
        warning,
        name,
      });
    }, 0);
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

