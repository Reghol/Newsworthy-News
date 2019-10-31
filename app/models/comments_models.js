const connection = require('../../connection');

exports.changeCommentVotesById = (comment_id, body) => {
  const keys = Object.keys(body);
  if (!keys.includes('inc_votes')) {
    return Promise.reject({
      msg: 'The request does not contain property: inc_votes in its body',
      status: 400
    });
  }

  if (keys.length != 1) {
    return Promise.reject({
      msg:
        'The request body must have exactly one property: inc_votes. Check your request body',
      status: 400
    });
  }

  if (typeof body.inc_votes !== 'number') {
    return Promise.reject({
      msg: 'inc_votes is not a number. Check the body of your request',
      status: 400
    });
  }
  return connection
    .select('*')
    .from('comments')
    .where({ 'comments.comment_id': comment_id })
    .increment('votes', body.inc_votes || 0)
    .returning('*')
    .then(changedComment => {
      // console.log(changedComment);
      if (!changedComment.length) {
        return Promise.reject({
          status: 404,
          msg: `comment: ${comment_id} does not exist`
        });
      }
      return changedComment;
    });
};

exports.eraseCommentById = id => {
  return connection('comments')
    .where({ comment_id: id })
    .del()
    .returning('*')
    .then(erased => {
      if (!erased.length) {
        return Promise.reject({
          status: 404,
          msg: `comment: ${id} does not exist`
        });
      }
    });
};
