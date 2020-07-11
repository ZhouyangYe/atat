const { COMMANDS, appList, common } = require('./enum');
const { buildAll } = require('./core');
const { clearScreen, modifyConsole } = require('./utils');

modifyConsole();

const args = process.argv.splice(2);

const command = args[0];
const option = args[1];

const allApps = [...appList, common];

clearScreen();

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
