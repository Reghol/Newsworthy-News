const {
  eraseCommentById,
  changeCommentVotesById
} = require('../models/comments_models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  eraseCommentById(comment_id)
    .then(erased => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.updateCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const body = req.body;
  changeCommentVotesById(comment_id, body)
    .then(updatedComment => {
      res.status(200).send({ comment: updatedComment[0] });
    })
    .catch(next);
};
