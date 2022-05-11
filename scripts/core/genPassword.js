const fs = require('fs');
const { encryptPassword } = require('@/utils/encryption');

const updatePassword = (text) => {
  const result = JSON.stringify(encryptPassword(text));

  fs.writeFile('./data.json', result, (err) => {
    if (err) {
      console.error(err, true);
    } else {
      console.info('Password updated.', true);
    }
  });
};

module.exports = updatePassword;
