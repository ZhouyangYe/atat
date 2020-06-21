const { deliverHtmlFile } = require('../utils');

const algorithmsHandler = (req, res) => {
  deliverHtmlFile('algorithms', res);
};

module.exports = {
  algorithmsHandler,
};
