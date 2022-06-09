const cmd = require('node-cmd');

const syncCommon = () => {
  return new Promise((res, rej) => {
    cmd.run('npm install ./apps/common', (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data);
    });
  });
};

module.exports = syncCommon;
