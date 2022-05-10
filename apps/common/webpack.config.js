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
    ['services/admin']: path.resolve(__dirname, './src/services/admin/index.ts'),
    ['modules/loading']: path.resolve(__dirname, './src/modules/loading/index.ts'),
    ['modules/scrollable']: path.resolve(__dirname, './src/modules/scrollable/index.ts'),
    ['modules/door']: path.resolve(__dirname, './src/modules/door/index.ts'),
    ['modules/audio']: path.resolve(__dirname, './src/modules/audio/index.ts'),
    ['modules/scroll']: path.resolve(__dirname, './src/modules/scroll/index.ts'),
    ['modules/crystal']: path.resolve(__dirname, './src/modules/crystal/index.ts'),
    ['modules/lamp']: path.resolve(__dirname, './src/modules/lamp/index.ts'),
    ['modules/resume']: path.resolve(__dirname, './src/modules/resume/index.ts'),
    ['modules/message']: path.resolve(__dirname, './src/modules/message/index.ts'),
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
