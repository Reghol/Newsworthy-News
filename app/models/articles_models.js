const connection = require('../../connection');

exports.selectArticleById = article => {
  return connection
    .select('articles.*')
    .from('articles')
    .where({ 'articles.article_id': article })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count({ comment_count: 'comment_id' })
    .then(selectedArticle => {
      // console.log(selectedArticle);
      if (!selectedArticle.length)
        return Promise.reject({
          status: 404,
          msg: `article_id: ${article} is not in the database`
        });
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

exports.selectCommentsByArticle = () => {
  console.log('hi');
};
