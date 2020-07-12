const { COMMANDS, appList, common, BUILD_MODE } = require('./enum');
const { buildAll, buildSingle } = require('./core');
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
      buildSingle(option, BUILD_MODE.BUILD);
    }
    break;
  case COMMANDS.DEV:
    if (!option) {
      console.warn('Please make sure which app you want to start dev.', true);
    } else {
      buildSingle(option, BUILD_MODE.DEV);
    }
    break;
  default:
    console.error('Command not valid!', true);
    break;
}
