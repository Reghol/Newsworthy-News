const connection = require('../../connection');
exports.eraseCommentById = id => {
  return connection('comments')
    .where({ comment_id: id })
    .del()
    .returning('*');
  // .then(deletedComment => {
  //   return deletedComment;
  // });
};
