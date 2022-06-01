const fs = require('fs');
const ignore = require('./ignore');

const getPath = (path) => {
  return `./${path}`;
};

const reError = (res) => {
  res.json({
    success: false,
    errorMessage: 'File unavailable.',
  });
};

const resData = (res, data) => {
  res.json({
    success: true,
    data,
  });
};

const getFileInfo = (req, res) => {
  const { params } = req;
  const units = decodeURI(params.path || '').split('^');
  const path = units.join('/') || '';

  const combinedPath = getPath(path);

  if (ignore.test(combinedPath)) {
    reError(res);
    return;
  }

  fs.stat(combinedPath, (err, stats) => {
    if (err) {
      reError(res);
      return;
    }

    if (stats.isDirectory()) {
      fs.readdir(combinedPath, (error, files) => {
        if (error) {
          reError(res);
          return;
        }

        resData(res, { isDir: true, files: files.filter((file) => !ignore.test(`${combinedPath}/${file}`))});
      });
    }

    if (stats.isFile()) {
      fs.readFile(combinedPath, 'utf-8', (error, data) => {
        if (error) {
          reError(res);
          return;
        }

        resData(res, { isDir: false, data });
      });
    }
  });
};

module.exports = {
  getFileInfo,
};