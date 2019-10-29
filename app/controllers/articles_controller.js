const {
  selectArticleById,
  updateArticleById,
  insertCommentIntoArticle,
  selectCommentsByArticle
} = require('../models/articles_models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticleById(article_id, body)
    .then(updatedArticle => {
      res.status(201).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.postCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  insertCommentIntoArticle(article_id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticle(article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
