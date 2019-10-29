const { selectArticleById } = require('../models/articles_models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id);
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
