const ignore_list = [
  /(\.git)$/,
  'package-lock.json',
  'dist',
  'node_modules',
  'common/lib',
  'utils/ssl',
];

const forbidden_list = [
  ...ignore_list,
  './data.json',
  'server.config',
  /(\.jpeg|\.jpg|\.png|\.gif|\.bmp|\.map|\.otf|\.woff|\.ttf|\.eot|\.mp3|\.mp4|\.svg|\.ico|\.fbx)$/,
];

const test = (path, disableRead = true) => {
  const list = disableRead ? forbidden_list : ignore_list;

  for (let i = 0, length = list.length; i < length; i++) {
    if (typeof list[i] === 'object') {
      if (list[i].test(path)) {
        return true;
      }
    } else if (path.includes(list[i])) {
      return true;
    }
  }

  return false;
};

module.exports = {
  test,
};
