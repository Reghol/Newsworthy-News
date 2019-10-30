const commentsRouter = require('express').Router();

const {
  deleteCommentById,
  updateCommentById
} = require('../controllers/comments_controller');

commentsRouter
  .route('/:comment_id')
  .patch(updateCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
