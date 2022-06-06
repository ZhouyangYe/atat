const path = require('path');
const { merge } = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackCommon = require(path.resolve(__dirname, '../../webpack_common'));
const { WEBPACK_MODE } = require('../enum');

const getAppPath = (name, subPath) => {
  return path.resolve(__dirname, `../../apps/${name}${subPath}`);
};

// build path related configs
const buildCommonConfig = (config, name) => {
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
  const completeConfig = merge(webpackCommon, config);
  completeConfig.mode = WEBPACK_MODE.DEV;

  completeConfig.devtool = 'source-map'; // add sourcemap for dev mode
  completeConfig.module.rules.forEach(rule => {
    if (rule.id === 'css-loaders') { // enable source map for css loaders
      if (rule.use) rule.use.forEach(loader => {
        if (loader.options) {
          loader.options.sourceMap = true;
        }
      });
    }
    delete rule.id;
  });

  // use local code for dev
  if (config.externals) {
    completeConfig.externals = undefined;
  }

  return buildCommonConfig(completeConfig, name);
};

// get web pack config for production mode
const buildProdConfig = (config, name) => {
  const completeConfig = merge(webpackCommon, config);
  completeConfig.mode = WEBPACK_MODE.PROD;

  const cssMinifyPlugin = new OptimizeCSSAssetsPlugin({}); // minify css

  const jsMinifyPlugin = new TerserPlugin({ // uglify js
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
      minimize: true,
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
