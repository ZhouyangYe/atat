const { deliverHtmlFile } = require('../utils');

const adminHandler = (req, res) => {
  deliverHtmlFile('admin', res);
};

module.exports = {
  adminHandler,
};
