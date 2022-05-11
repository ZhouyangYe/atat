require('../utils/overrideRequire');
const { COMMANDS, appList, common, node_modules, BUILD_MODE } = require('./enum');
const { buildAll, buildSome, cleanApps, updatePassword } = require('./core');
const { clearScreen, modifyConsole } = require('./utils');

modifyConsole();

const args = process.argv.splice(2);

const [command, ...subArgs] = args;

const allApps = [...appList, common];

clearScreen();

const contains = (allItems, items) => {
  return items.reduce((result, current) => {
    return allItems.includes(current) && result;
  }, true);
};

switch (command) {
  case COMMANDS.BUILD:
    if (!subArgs.length) {
      buildAll();
    } else if (contains(allApps, subArgs)) {
      buildSome(subArgs, BUILD_MODE.BUILD);
    } else {
      console.error('Invalid apps!', true);
      console.info(`Apps should be within: ${allApps.join(', ')}.`);
    }
    break;
  case COMMANDS.DEV:
    if (!subArgs.length) {
      console.warn('Please make sure which apps you want to start dev.', true);
    } else if (contains(allApps, subArgs)) {
      buildSome(subArgs, BUILD_MODE.DEV);
    } else {
      console.error('Invalid apps!\n', true);
      console.info(`Apps should be one of these: ${allApps.join(', ')}.`, true);
    }
    break;
  case COMMANDS.CLEAN:
    if (!subArgs.length) {
      cleanApps(allApps);
    } else if (contains([...allApps, node_modules], subArgs)) {
      cleanApps(subArgs);
    } else {
      console.error('Invalid apps!\n', true);
      console.info(`Apps should be one of these: ${allApps.join(', ')}.`, true);
    }
    break;
  case COMMANDS.PASSWORD:
    if (!subArgs.length) {
      console.error('Please enter new password.');
    } else {
      updatePassword(subArgs[0]);
    }
    break;
  default:
    console.error('Command not valid!', true);
    break;
}
