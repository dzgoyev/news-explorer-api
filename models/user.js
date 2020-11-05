const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const mongooseValidator = require('mongoose-unique-validator');

const emailValidation = {
  require: true,
};

const emailValidation = {
  require: true,
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 30,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email, emailValidation),
      },
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }

      return bcryptjs.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        return user;
      });
    });
};

userSchema.plugin(mongooseValidator);

module.exports = mongoose.model('user', userSchema);
