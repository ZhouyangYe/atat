const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json'], // import file extensions
    modules: [ // where to find the imported file
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../apps/common')
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader', // compile typescript
        exclude: /node_modules/
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,  // output css to file
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader', // import css in javascript
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'less-loader', // compile less
            options: {
              sourceMap: true
            }
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
        terserOptions: {}
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }) // output css to file
  ]
};
