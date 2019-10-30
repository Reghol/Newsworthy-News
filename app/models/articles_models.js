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

exports.selectCommentsByArticle = (
  article_id,
  sortBy = 'created_at',
  order = 'desc'
) => {
  return connection
    .select('*')
    .from('comments')
    .where({ article_id: article_id })
    .orderBy(sortBy, order)
    .then(comments => {
      return comments;
    });
};

exports.selectAllArticles = query => {
  const sort = query.sortBy || 'created_at';
  const order = query.order || 'desc';

  return connection
    .select('articles.*')
    .from('articles')
    .modify(extraQueries => {
      if (query.author) extraQueries.where('articles.author', query.author);
      if (query.topic) extraQueries.where('articles.topic', query.topic);
    })
    .orderBy(sort, order)
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(result => {
      if (!result.length && query.author) {
        return Promise.reject({
          status: 404,
          msg: `No articles by: ${query.author}`
        });
      }
      if (!result.length && query.topic) {
        return Promise.reject({
          status: 404,
          msg: `No articles for topic: ${query.topic}`
        });
      }
      return result;
    });
};
