const articleRouter = require('express').Router();
const { validateId, validateArticle } = require('../middlewares/validator');

const { getArticles, createArticle, deleteArticle } = require('../controllers/article');

articleRouter.get('/articles', getArticles);
articleRouter.post('/articles', validateArticle, createArticle);
articleRouter.delete('/articles/:_id', validateId, deleteArticle);

module.exports = articleRouter;
