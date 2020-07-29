const path = require('path');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackCommon = require(path.resolve(__dirname, '../../webpack_common'));
const { WEBPACK_MODE } = require('../enum');

const getAppPath = (name, subPath) => {
  return path.resolve(__dirname, `../../apps/${name}${subPath}`);
};

// build path related configs
const buildCommonConfig = (config, name) => {
  config.entry = getAppPath(name, '/src/index.ts'); // entry file
  config.resolve.modules.push(getAppPath(name, '/src')); // where to find the imported file in specific app folder
  
  const customTsconfigPlugin = new TsconfigPathsPlugin({ // custom tsconfig.json file path
    configFile: getAppPath(name, '/tsconfig.json'),
  });
  if (config.resolve.plugins) {
    config.resolve.plugins.push(customTsconfigPlugin);
  } else {
    config.resolve.plugins = [customTsconfigPlugin];
  }

  return config;
};

// get web pack config for development mode
const buildDevConfig = (config, name) => {
  const completeConfig = merge(webpackCommon, config);
  completeConfig.mode = WEBPACK_MODE.DEV;

  completeConfig.devtool = 'source-map'; // add sourcemap for dev mode
  completeConfig.module.rules.forEach(rule => {
    if (rule.id === 'css-loaders') { // enable source map for css loaders
      if (rule.use) rule.use.forEach(loader => {
        if (loader.options) {
          loader.options.sourceMap = true;
        } else {
          loader.options = {
            sourceMap: true,
          };
        }
      });
    }
    delete rule.id;
  });

  return buildCommonConfig(completeConfig, name);
};

// get web pack config for production mode
const buildProdConfig = (config, name) => {
  const completeConfig = merge(webpackCommon, config);
  completeConfig.mode = WEBPACK_MODE.PROD;

  const cssMinifyPlugin = new OptimizeCSSAssetsPlugin({}); // minify css

  const jsMinifyPlugin = new TerserPlugin({ // uglify js
    cache: true,
    parallel: true,
    terserOptions: {},
  });

  if (completeConfig.optimization) {
    if (completeConfig.optimization.minimizer) {
      completeConfig.optimization.minimizer.push(cssMinifyPlugin, jsMinifyPlugin);
    } else {
      completeConfig.optimization.minimizer = [cssMinifyPlugin, jsMinifyPlugin];
    }
  } else {
    completeConfig.optimization = {
      minimizer: [cssMinifyPlugin, jsMinifyPlugin],
    };
  }

  completeConfig.module.rules.forEach(rule => { // remove custom property in case webpack throws errors
    delete rule.id;
  });

  return buildCommonConfig(completeConfig, name);
};

module.exports = {
  buildDevConfig,
  buildProdConfig,
};
