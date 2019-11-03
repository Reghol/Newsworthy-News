const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentForArticle,
  getCommentsByArticle,
  getAllArticles,
  postArticle
} = require('../controllers/articles_controller');

const { send405error } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405error);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentForArticle)
  .get(getCommentsByArticle)
  .all(send405error);
articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(postArticle)
  .all(send405error);

module.exports = articlesRouter;
