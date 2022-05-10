const crypto = require('crypto-js');

const encryptPassword = (str, secret) => {
  const buf = crypto.randomBytes(16);
  secret = buf.toString('hex');

  const signature = crypto.createHmac('sha1', secret);
  signature.update(str);
  const result = signature.digest().toString('base64');

  return result;
};

module.exports = {
  encryptPassword,
};
