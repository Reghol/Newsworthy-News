const { eraseCommentById } = require('../models/comments_models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  eraseCommentById(comment_id)
    .then(erased => {
      res.sendStatus(204);
    })
    .catch(next);
};
