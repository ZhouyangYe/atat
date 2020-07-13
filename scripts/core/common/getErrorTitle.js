const chalk = require('chalk');

const getErrorTitle = (title) => (`<${chalk.yellow('Error')}> ${chalk.cyan(title)} ------------------------>\n\n`);

module.exports = getErrorTitle;
