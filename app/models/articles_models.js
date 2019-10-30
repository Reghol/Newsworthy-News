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
      if (!selectedArticle.length)
        return Promise.reject({
          status: 404,
          msg: `article_id: ${article} is not in the database`
        });
      return selectedArticle;
    });
};

exports.updateArticleById = (article_id, body) => {
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
  if (order != 'desc' && order != 'asc') {
    return Promise.reject({
      msg: "Order must must be either 'asc' or 'desc'.",
      status: 400
    });
  }
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
  if (order != 'desc' && order != 'asc') {
    return Promise.reject({
      msg: "Order must must be either 'asc' or 'desc'.",
      status: 400
    });
  }
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
