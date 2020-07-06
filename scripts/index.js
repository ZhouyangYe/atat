const clear = require('clear');
const { getCustomText } = require('./text');
const { COMMANDS, appList, common } = require('./enum');
const { buildAll } = require('./core');

const args = process.argv.splice(2);

const command = args[0];
const option = args[1];

const allApps = [...appList, common];

switch (command) {
  case COMMANDS.BUILD:
    if (!option) {
      buildAll();
    } else if (allApps.includes(option)) {
      break;
    }
    break;
  case COMMANDS.DEV:

    break;
  default:
    break;
}

clear();

// process.stdout.write("\r" + P[x++]);

const text = getCustomText('BT', ['red', 'bgYellow']);
console.log(text);

