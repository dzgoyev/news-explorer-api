const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};
