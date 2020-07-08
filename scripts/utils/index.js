const clear = require('clear');
const { getCustomText } = require('./text');

const clearScreen = () => {
  const text = getCustomText('Hello BT!', ['cyan'], {
    font: 'Standard',
    horizontalLayout: 'full',
  });
  clear();
  console.log(text);
};

module.exports = {
  clearScreen,
};
