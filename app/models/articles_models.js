const connection = require('../../connection');

exports.selectArticleById = article => {
  return connection
    .select('author', 'title', 'topic', 'body', 'created_at', 'votes')
    .from('articles')
    .where({ 'articles.article_id': article })
    .then(selectedArticle => {
      if (!selectedArticle.length)
        return Promise.reject({ status: 404, msg: `No such resource exists` });
      return selectedArticle;
    });
};

exports.updateArticleById = (article_id, body) => {
  return connection
    .select('*')
    .from('articles')
    .where({ 'articles.article_id': article_id })
    .increment('votes', body.inc_votes)
    .returning('*')
    .then(changedVoteCount => {
      return changedVoteCount;
    });
};

exports.insertCommentIntoArticle = (article_id, body) => {
  let insertComment = {
    article_id: article_id,
    body: body.body,
    author: body.username
  };
  return connection
    .insert(insertComment)
    .into('comments')
    .returning('*')
    .then(insertedComment => {
      return insertedComment;
    });
};
