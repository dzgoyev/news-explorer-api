const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Такой пользователь не найден' });
    })
    .then((user) => res.send({ data: { email: user.email, name: user.name } }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => res.status(201).send({
      email: data.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError(err));
      } else {
        next(new BadRequestError(err));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError({ message: 'Неправильная почта или пароль' });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      //   sameSite: true,
      // });
      res.send({ token });
    })
    // .send({ message: 'Авторизация прошла успешно' });

    .catch(next);
};

module.exports = {
  getUserInfo, createUser, login,
};
