let admin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.send('You are not Allowed');
  }

  next();
};

module.exports = { admin };
