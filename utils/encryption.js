const crypto = require('crypto');

const encryptPassword = (str, sec) => {
  let secret;

  if (!sec) {
    const buf = crypto.randomBytes(16);
    secret = buf.toString('hex');
  } else {
    secret = sec;
  }

  const signature = crypto.createHmac('sha1', secret);
  signature.update(str);
  const result = signature.digest().toString('base64');

  return {
    secret,
    encryptPassword: result,
  };
};

module.exports = {
  encryptPassword,
};
