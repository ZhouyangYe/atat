const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json'], // import file extensions
    modules: [ // where to find the imported file
      path.resolve(__dirname, '../node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader', // compile typescript
        exclude: /node_modules/,
      },
      {
        id: 'css-loaders',
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
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ // output css to file
      filename: 'main.css',
    }),
  ],
};
