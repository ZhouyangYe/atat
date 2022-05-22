const cookie = require('cookie');
const { session } = require('../../utils');

const checkWhetherLoggedIn = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');

  if (cookies.atat_id === session.admin.session_id) {
    clearTimeout(session.admin.session_timer);
    session.admin.session_timer = setTimeout(() => {
      session.admin.session_id = null;
      session.admin.ip = null;
    }, session.admin.expire_time);

    next();
    return;
  }
  
  res.json({
    success: false,
    errorCode: 401,
    errorMessage: 'Not authorized.',
  });
};

module.exports = checkWhetherLoggedIn;