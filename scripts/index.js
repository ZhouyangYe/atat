const { COMMANDS, appList, common, BUILD_MODE } = require('./enum');
const { buildAll, buildSome } = require('./core');
const { clearScreen, modifyConsole } = require('./utils');

modifyConsole();

const args = process.argv.splice(2);

const [command, ...apps] = args;

const allApps = [...appList, common];

clearScreen();

const contains = (allItems, items) => {
  return items.reduce((result, current) => {
    return allItems.includes(current) && result;
  }, true);
};

switch (command) {
  case COMMANDS.BUILD:
    if (!apps) {
      buildAll();
    } else if (contains(allApps, apps)) {
      buildSome(apps, BUILD_MODE.BUILD);
    } else {
      console.error('Invalid apps!', true);
      console.info(`Apps should be within: ${allApps.join(', ')}.`);
    }
    break;
  case COMMANDS.DEV:
    if (!apps) {
      console.warn('Please make sure which apps you want to start dev.', true);
    } else if (contains(allApps, apps)) {
      buildSome(apps, BUILD_MODE.DEV);
    } else {
      console.error('Invalid apps!\n', true);
      console.info(`Apps should be one of these: ${allApps.join(', ')}.`, true);
    }
    break;
  default:
    console.error('Command not valid!', true);
    break;
}
