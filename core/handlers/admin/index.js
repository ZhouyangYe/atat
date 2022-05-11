const { v4: uuidv4 } = require('uuid');
const cookie = require('cookie');
const { session } = require('../utils');

const adminHandler = (req, res) => {
  res.html('admin');
};

const loginHandler = (req, res) => {
  const id = uuidv4();
  session.admin.session_id = id;
  session.admin.ip = req.socket.remoteAddress;

  session.admin.session_timer = setTimeout(() => {
    session.admin.session_id = null;
    session.admin.ip = null;
  }, session.admin.expire_time);

  res.json({
    success: true,
    data: 'Welcome back!',
  }, {
    'Set-Cookie': cookie.serialize('atat_id', String(id), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }),
  });
};

module.exports = {
  adminHandler,
  loginHandler,
};
