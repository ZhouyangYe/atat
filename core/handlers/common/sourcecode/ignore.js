const ignore_list = [
  /(\.jpeg|\.jpg|\.png|\.gif|\.bmp|\.map|\.otf|\.woff|\.ttf|\.mp3|\.mp4|\.svg|\.ico|\.fbx)$/,
  /(\.git)$/,
  'package-lock.json',
  './data.json',
  'vscodeConfigs',
  'server.config',
  'dist',
  'node_modules',
  'common/lib',
];

const test = (path, disableRead = true) => {
  for (let i = 0, length = ignore_list.length; i < length; i++) {
    if (i === 0) {
      if (!disableRead) {
        continue;
      }
      if (ignore_list[i].test(path)) {
        return true;
      }
    }
    if (typeof ignore_list[i] === 'object') {
      if (ignore_list[i].test(path)) {
        return true;
      }
    } else if (path.includes(ignore_list[i])) {
      return true;
    }
  }

  return false;
};

module.exports = {
  test,
};
