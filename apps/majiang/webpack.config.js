const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
  },
  resolve: {
    extensions: [".ts", ".vue"],
  },
  plugins: [
    new MiniCssExtractPlugin({ // output css to file
      filename: 'main.css',
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      }
    ],
  },
};
