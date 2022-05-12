const cookie = require('cookie');
const { session } = require('../../utils');

const checkWhetherLoggedIn = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  let loggedIn = false;

  if (cookies.atat_id === session.admin.session_id) {
    clearTimeout(session.admin.session_timer);
    session.admin.session_timer = setTimeout(() => {
      session.admin.session_id = null;
      session.admin.ip = null;
    }, session.admin.expire_time);

    loggedIn = true;
  }

  next({
    loggedIn,
  });
};

module.exports = checkWhetherLoggedIn;
