const { delta, initLine } = require('../../enum');

/**
 * @description Get the current line, count in the lines logo takes
 * @param {number} line Current line in spite of the lines logo takes
 */
const getCurrentLine = (line) => {
  return line * delta + initLine;
};

module.exports = getCurrentLine;
