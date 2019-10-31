const commentsRouter = require('express').Router();
const { send405error } = require('../errors');
const {
  deleteCommentById,
  updateCommentVotesById
} = require('../controllers/comments_controller');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentVotesById)
  .delete(deleteCommentById)
  .all(send405error);

commentsRouter.route('/').all(send405error);
module.exports = commentsRouter;
