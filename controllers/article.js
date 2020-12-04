const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .then((articles) => res.send(articles))
    .catch((err) => next(new BadRequestError(err)));
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => next(new BadRequestError(err)));
};

const deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findById({ _id: req.params._id }).select('+owner')
    .orFail(() => new NotFoundError({ message: 'Нет такой новости' }))
    .then((article) => {
      if (String(article.owner) !== owner) throw new ForbiddenError({ message: 'Недостаточно прав' });
      return Article.deleteOne(article);
    })
    .then(() => res.send({ message: 'Успешное удаление' }))
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
