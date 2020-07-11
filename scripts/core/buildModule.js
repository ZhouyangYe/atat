
const path = require('path');
const { Worker } = require('worker_threads');
const { WEBPACK_MESSAGE_TYPE } = require('../enum');

const buildModule = (name, mode, handler, start, done) => {
  if (start) start(name);

  // Let worker handler webpack compilation
  const worker = new Worker(path.resolve(__dirname, './compilerWorker.js'), {
    workerData: {
      name,
      mode,
    },
  });

  worker.on('message', (data) => {
    if (data.type === WEBPACK_MESSAGE_TYPE.HANDLER) {
      const { name, percentage } = data;
      handler(name, percentage);
    } else {
      const { name, err } = data;
      done(name, err);
    }
  });
};

module.exports = buildModule;
