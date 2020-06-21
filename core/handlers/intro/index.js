const { deliverHtmlFile } = require('../utils');

const introHandler = (req, res) => {
  deliverHtmlFile('intro', res);
};

module.exports = {
  introHandler,
};
