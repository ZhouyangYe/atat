const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: { // package entries
    styles: path.resolve(__dirname, './src/styles/index.ts'),
    utils: path.resolve(__dirname, './src/utils/index.ts'),
    enum: path.resolve(__dirname, './src/enum/index.ts'),
    ajax: path.resolve(__dirname, './src/ajax/index.ts'),
    framework: path.resolve(__dirname, './src/framework/index.ts'),
    ['services/intro']: path.resolve(__dirname, './src/services/intro/index.ts'),
    ['modules/loading']: path.resolve(__dirname, './src/modules/loading/index.ts'),
  },
  output: { // output location
    path: path.resolve(__dirname, "lib"),
    filename: "[name]/index.js",
    library: "atat-common",
    libraryTarget: "umd",
  },
  plugins: [
    new MiniCssExtractPlugin({ // output css to file
      filename: '[name]/index.css',
    }),
  ],
};
