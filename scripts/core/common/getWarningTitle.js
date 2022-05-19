const chalk = require('chalk');

const getWarningTitle = (title) => (`<${chalk.yellow('Warning')}> ${chalk.cyan(title)} ------------------------>\n\n`);

module.exports = getWarningTitle;
