const addWriteJson = require('./writeJson');
const addWriteHtml = require('./writeHtml');

module.exports = (response) => {
  addWriteJson(response);
  addWriteHtml(response);
};
