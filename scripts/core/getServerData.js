const fs = require('fs');
const path = require('path');

const getServerData = () => {
  return new Promise((res) => {
    fs.readFile(path.resolve('../../data.json'), 'utf-8', (err, data) => {
      if (err) {
        res();
        return;
      }

      res(JSON.parse(data));
    });
  });
};

module.exports = getServerData;
