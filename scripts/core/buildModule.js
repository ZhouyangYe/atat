const path = require('path');
const { Worker } = require('worker_threads');
const { WEBPACK_MESSAGE_TYPE, BUILD_MODE } = require('../enum');

/**
 * @description Create worker to compile code with webpack
 * @param {string} name Which app to compile
 * @param {string} mode Which mode to use (run or watch)
 * @param {(name:string,percentage:number)=>void} handler Handle progress info
 * @param {(name:string)=>void} start Invoked when the compiling starts
 * @param {(name:string,err:Error)=>void} done Invoked when the compiling is done
 */
const buildModule = (appName, mode, handler, start, done) => {
  let isStarted = true;
  if (start) start(appName);

  // Let worker handle webpack compilation
  const worker = new Worker(path.resolve(__dirname, './compilerWorker.js'), {
    workerData: {
      name: appName,
      mode,
    },
  });

  worker.on('message', (data) => {
    if (data.type === WEBPACK_MESSAGE_TYPE.HANDLER) {
      const { name, percentage } = data;
      if (!isStarted && mode === BUILD_MODE.DEV) {
        isStarted = true;
        start(name);
      }
      handler(name, percentage);
    } else {
      const { name, err } = data;
      done(name, err);
      isStarted = false;
    }
  });
};

module.exports = buildModule;
