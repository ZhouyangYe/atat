const cmd = require('node-cmd');
const { workerData, parentPort } = require('worker_threads');
const { common, node_modules } = require('../enum');

const { app } = workerData;

// remove dist or lib node_modules based on app name
const command = app === common ? 'rm -rf ./apps/common/lib' : app === node_modules ? 'rm -rf ./node_modules' : `rm -rf ./apps/${app}/dist`;
cmd.run(command, (err) => {
  if (err) {
    parentPort.postMessage({
      err,
      app,
    });
    return;
  }

  parentPort.postMessage({
    app,
  });
});