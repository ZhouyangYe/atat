const clear = require('clear');
const { getCustomText } = require('./text');

const args = process.argv.splice(2);

clear();

const twirlTimer = (function() {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  return setInterval(function() {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);
})();

const text = getCustomText(args[0], ['blue', 'bgRed']);

console.log(text);
