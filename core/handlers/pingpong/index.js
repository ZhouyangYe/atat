const { deliverHtmlFile } = require('../utils');

const pingpongHandler = (req, res) => {
  deliverHtmlFile('pingpong', res);
};

module.exports = {
  pingpongHandler,
};
