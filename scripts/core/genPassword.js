const fs = require('fs');
const path = require('path');
const { encryptPassword } = require('@/utils/encryption');
const getServerData = require('./getServerData');

const updatePassword = (text) => {
  const result = JSON.stringify(encryptPassword(text));

  getServerData().then((data) => {
    const newData = data ? {
      ...data,
      secret: result.secret,
      encryptPassword: result.encryptPassword,
    } : result;

    fs.writeFile(path.resolve(__dirname, '../../data.json'), newData, (err) => {
      if (err) {
        console.error(err, true);
      } else {
        console.info('Password updated.', true);
      }
    });
  });
};

module.exports = updatePassword;
