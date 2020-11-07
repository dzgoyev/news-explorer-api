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
  Article.findByIdAndRemove(req.params._id).select('+owner')
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Недостаточно прав для выполнения операции' });
      }
      if (!article) {
        throw new NotFoundError({ message: 'Новость не найдена' });
      }
      Article.deleteOne(article)
        .then(() => res.send({ message: 'Успешное удаление' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
