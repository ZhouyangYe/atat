const adminHandler = (req, res) => {
  res.html('admin');
};

const loginHandler = (req, res, extra) => {
  console.log(extra);

  res.json({
    success: true,
    data: req.body,
  });
};

module.exports = {
  adminHandler,
  loginHandler,
};
