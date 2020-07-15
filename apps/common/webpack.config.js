const path = require('path');
const merge = require('webpack-merge');
const webpackCommon = require(path.resolve(__dirname, '../../webpack_common'));
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = merge(webpackCommon, {
  entry: path.resolve(__dirname, "src/index.ts"), // entry file
  output: { // output location
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: "atat-common",
    libraryTarget: "umd"
  },
  resolve: {
    modules: [ // where to find the imported file
      path.resolve(__dirname, "./src"),
    ],
    plugins: [
      new TsconfigPathsPlugin({ // custom tsconfig.json file path
        configFile: path.resolve(__dirname, "./tsconfig.json")
      })
    ]
  }
});
