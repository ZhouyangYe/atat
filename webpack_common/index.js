const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'], // import file extensions
    modules: [ // where to find the imported file
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../apps/common')
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader', // compile typescript
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,  // output css to file
          {
            loader: 'css-loader' // import css in javascript
          },
          {
            loader: 'less-loader' // compile less
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
