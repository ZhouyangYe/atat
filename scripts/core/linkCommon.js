const cmd = require('node-cmd');

const linkCommon = () => {
  return new Promise((res, rej) => {
    cmd.get('npm run link-common', (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data);
    });
  });
};

module.exports = linkCommon;