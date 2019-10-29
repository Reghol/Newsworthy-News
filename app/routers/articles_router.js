const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentForArticle,
  getCommentsByArticle
} = require('../controllers/articles_controller');
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.route('/:article_id/comments').post(postCommentForArticle);
// .get(getCommentsByArticle);

module.exports = articlesRouter;
