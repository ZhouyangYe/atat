const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    chunkFilename: "[name]/index.js",
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    extensions: [".tsx"],
  },
  plugins: [
    new MiniCssExtractPlugin({ // output css to file
      filename: 'main.css',
      chunkFilename: '[name]/index.css',
    }),
  ],
};
