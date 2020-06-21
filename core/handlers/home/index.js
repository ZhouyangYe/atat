const { deliverHtmlFile } = require('../utils');

const homeHandler = (req, res) => {
  deliverHtmlFile('home', res);
};

module.exports = {
  homeHandler,
};
