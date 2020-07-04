const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const args = process.argv.splice(2);

clear();

const text = chalk.yellow(
  figlet.textSync(args[0], (err, data) => {
    if (err) {
      console.dir(err);
      return;
    }
    console.log(data);
  })
);

console.log(text);
