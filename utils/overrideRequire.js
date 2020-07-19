/**
 * Override module.require to support absolute path
 */ 
const Module = require('module');
const path = require('path');
global.base_dir = path.resolve(__dirname, '../');
const legacy = Module.prototype.require;
Module.prototype.require = function(filePath) {
  if (/^@\//.test(filePath)) {
    const relativePath = filePath.slice(2);
    return legacy.call(this, path.resolve(global.base_dir, relativePath));
  }
  return legacy.call(this, filePath);
};
