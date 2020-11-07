const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isUrl = (url) => {
  if (!validator.isURL(url)) {
    throw new Error('Введите правильный URL');
  }
  return url;
};

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(isUrl).required(),
    image: Joi.string().custom(isUrl).required(),
  }),
});

module.exports = {
  validateId,
  validateUser,
  validateLogin,
  validateArticle,
};
