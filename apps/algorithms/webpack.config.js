const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"), // entry file
  output: { // output location
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"], // import file extensions
    modules: [ // where to find the imported file
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "../../node_modules")
    ],
    plugins: [
      new TsconfigPathsPlugin({ // custom tsconfig.json file path
        configFile: path.resolve(__dirname, "./tsconfig.json")
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader", // compile typescript
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,  // output css to file
          {
            loader: "css-loader" // import css in javascript
          },
          {
            loader: "less-loader" // compile less
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}), // minify css
      new TerserPlugin({ // uglify js
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {}
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin() // output css to file
  ]
};
