const { deliverHtmlFile } = require('../utils');

const hahahaHandler = (req, res) => {
  deliverHtmlFile('hahaha', res);
};

module.exports = {
  hahahaHandler,
};
