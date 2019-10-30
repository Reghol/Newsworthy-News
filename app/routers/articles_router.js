const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postCommentForArticle,
  getCommentsByArticle,
  getAllArticles
} = require('../controllers/articles_controller');
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentForArticle)
  .get(getCommentsByArticle);

articlesRouter.route('/').get(getAllArticles);

module.exports = articlesRouter;
