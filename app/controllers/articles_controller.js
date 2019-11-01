const {
  selectArticleById,
  updateArticleById,
  insertCommentIntoArticle,
  selectCommentsByArticle,
  selectAllArticles
} = require('../models/articles_models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticleById(article_id, body)
    .then(updatedArticle => {
      res.status(200).send({ article: updatedArticle[0] });
    })
    .catch(next);
};

exports.postCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  insertCommentIntoArticle(article_id, body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, limit, p } = req.query;
  selectCommentsByArticle(article_id, sort_by, order, limit, p)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const query = req.query;
  selectAllArticles(query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
