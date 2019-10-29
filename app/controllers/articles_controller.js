const {
  selectArticleById,
  updateArticleById,
  insertCommentIntoArticle
} = require('../models/articles_models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id);
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
      // console.log(updatedArticle);
      res.status(201).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.postCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  console.log(body);
  insertCommentIntoArticle(article_id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
