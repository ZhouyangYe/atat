const adminHandler = (req, res) => {
  res.html('admin');
};

const loginHandler = (req, res) => {
  res.json({
    success: true,
    data: req.body,
  });
};

module.exports = {
  adminHandler,
  loginHandler,
};
