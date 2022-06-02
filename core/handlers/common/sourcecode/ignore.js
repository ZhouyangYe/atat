const forbidden_list = [
  /(\.git)$/,
  'package-lock.json',
  'dist',
  'node_modules',
  'common/lib',
];

const ignore_list = [
  ...forbidden_list,
  './data.json',
  'server.config',
  /(\.jpeg|\.jpg|\.png|\.gif|\.bmp|\.map|\.otf|\.woff|\.ttf|\.mp3|\.mp4|\.svg|\.ico|\.fbx)$/,
];

const test = (path, disableRead = true) => {
  const list = disableRead ? ignore_list : forbidden_list;

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
