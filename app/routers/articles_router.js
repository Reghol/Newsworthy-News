const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentForArticle,
  getCommentsByArticle,
  getAllArticles
} = require('../controllers/articles_controller');

const { send405error } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentForArticle)
  .get(getCommentsByArticle);

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(send405error);

module.exports = articlesRouter;
