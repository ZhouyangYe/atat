const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackCommon = require(path.resolve(__dirname, '../../webpack_common'));
const { WEBPACK_MODE } = require('../enum');

const getAppPath = (name, subPath) => {
  return path.resolve(__dirname, `../../apps/${name}${subPath}`);
};

// build path related configs
const buildCommonConfig = (config, name) => {
  // pick the last one if there are multiple ts loaders
  const unifiedRules = [], rules = config.module.rules;
  let tsLoaderAdded = false;
  for (let i = rules.length - 1; i >= 0; i--) {
    if (rules[i].loader === 'ts-loader') {
      if (!tsLoaderAdded) {
        unifiedRules.push(rules[i]);
        tsLoaderAdded = true;
        continue;
      }
      continue;
    }
    unifiedRules.push(rules[i]);
  }
  config.module.rules = unifiedRules;

  if (!config.output) { // if output is not set, use the default output path and filename
    config.output = {
      path: getAppPath(name, '/dist'), // default output path
      filename: 'main.js', // default filename
    };
  }

  if (!config.entry) { // if entry file is not set, use the default one
    config.entry = getAppPath(name, '/src/index.ts');
  }
  config.resolve.modules.push(getAppPath(name, '/src')); // where to find the imported file in specific app folder
  
  const customTsconfigPlugin = new TsconfigPathsPlugin({ // custom tsconfig.json file path
    configFile: getAppPath(name, '/tsconfig.json'),
  });
  if (config.resolve.plugins) {
    config.resolve.plugins.push(customTsconfigPlugin);
  } else {
    config.resolve.plugins = [customTsconfigPlugin];
  }

  if (!config.plugins) {
    config.plugins = [
      new MiniCssExtractPlugin({ // output css to file
        filename: 'main.css',
      }),
    ];
  }

  return config;
};

// get web pack config for development mode
const buildDevConfig = (config, name) => {
  const completeConfig = merge(webpackCommon.common, webpackCommon[WEBPACK_MODE.DEV], config);

  // use local code for dev
  if (config.externals) {
    completeConfig.externals = undefined;
  }

  return buildCommonConfig(completeConfig, name);
};

// get web pack config for production mode
const buildProdConfig = (config, name) => {
  const completeConfig = merge(webpackCommon.common, webpackCommon[WEBPACK_MODE.PROD], config);

  return buildCommonConfig(completeConfig, name);
};

module.exports = {
  buildDevConfig,
  buildProdConfig,
};
