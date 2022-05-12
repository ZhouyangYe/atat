const fs = require('fs');
const { encryptPassword } = require('@/utils/encryption');

const comparePassword = (req, res, next, extra) => {
  if (extra && extra.loggedIn) {
    res.json({
      success: true,
    });

    return;
  }

  if (!req.body || !req.body.password) {
    res.json({
      success: false,
      errorCode: 406,
      errorMessage: 'Authentication failed.',
    });
    return;
  }

  fs.readFile('data.json', 'utf-8', (err, data) => {
    try {
      const d = JSON.parse(data);
      const password = encryptPassword(req.body.password, d.secret).encryptPassword;
  
      if (password === d.encryptPassword) {
        next();
        return;
      }
    } catch(e) {
      res.json({
        success: false,
        errorCode: 403,
      });
      return;
    }

    res.json({
      success: false,
      errorCode: 406,
      errorMessage: 'Authentication failed.',
    });

    // setTimeout(() => {
    //   res.json({
    //     success: false,
    //     errorCode: 406,
    //     errorMessage: 'Authentication failed.',
    //   });
    // }, 3000);
  });
};

module.exports = comparePassword;
