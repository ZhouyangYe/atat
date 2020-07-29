const path = require('path');

module.exports = {
  output: { // output location
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: "atat-common",
    libraryTarget: "umd"
  },
};
