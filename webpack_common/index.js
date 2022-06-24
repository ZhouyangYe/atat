const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WEBPACK_MODE } = require('../scripts/enum');

const cssMinifyPlugin = new OptimizeCSSAssetsPlugin({}); // minify css

const jsMinifyPlugin = new TerserPlugin({ // uglify js
  parallel: true,
  terserOptions: {},
});

module.exports = {
  common: {
    resolve: {
      extensions: ['.js', '.ts', '.json'], // import file extensions
      modules: [ // where to find the imported file
        path.resolve(__dirname, '../node_modules'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader', // compile typescript
          exclude: /node_modules/,
        },
      ],
    },
  },

  [WEBPACK_MODE.PROD]: {
    mode: WEBPACK_MODE.PROD,
    module: {
      rules: [
        {
          test: /\.(less|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,  // output css to file
            },
            {
              loader: 'css-loader', // import css in javascript
              options: {
                url: false,
              },
            },
            {
              loader: 'less-loader', // compile less
              options: {},
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        cssMinifyPlugin,
        jsMinifyPlugin,
      ],
    }
  },

  [WEBPACK_MODE.DEV]: {
    mode: WEBPACK_MODE.DEV,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(less|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,  // output css to file
            },
            {
              loader: 'css-loader', // import css in javascript
              options: {
                url: false,
                sourceMap: true,
              },
            },
            {
              loader: 'less-loader', // compile less
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
  },
};
