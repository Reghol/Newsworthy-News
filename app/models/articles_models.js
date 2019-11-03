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

  if (
    (keys.length > 0 && !body.inc_votes) ||
    (body.inc_votes && keys.length > 1)
  ) {
    return Promise.reject({
      msg:
        'The request body must have exactly one property: inc_votes. Check your request body',
      status: 400
    });
  }

  if (body.inc_votes && typeof body.inc_votes !== 'number') {
    return Promise.reject({
      msg: 'inc_votes is not a number. Check the body of your request',
      status: 400
    });
  }

  return connection
    .select('*')
    .from('articles')
    .where({ 'articles.article_id': article_id })
    .increment('votes', body.inc_votes || 0)
    .returning('*')
    .then(changedVoteCount => {
      if (!changedVoteCount.length) {
        return Promise.reject({
          msg: `Article ${article_id} not found`,
          status: 404
        });
      }
      return changedVoteCount;
    });
};

exports.insertCommentIntoArticle = (article_id, body) => {
  const keys = Object.keys(body);
  if (!keys.includes('username' && 'body')) {
    return Promise.reject({
      msg:
        'The request does not include all the required keys: username and body',
      status: 400
    });
  }
  if (keys.length != 2) {
    return Promise.reject({
      msg:
        'The request body must have exactly two properties: username and body. Check your request body',
      status: 400
    });
  }

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
      if (!insertedComment) {
        return Promise.reject({
          msg: `Not found. ${article_id} is not found, hence no comments for such article exist`,
          status: 404
        });
      }
      return insertedComment;
    });
};

exports.selectCommentsByArticle = (
  article_id,
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1
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
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .then(comments => {
      return comments;
    });
};

exports.selectAllArticles = query => {
  const sort = query.sort_by || 'created_at';
  const order = query.order || 'desc';
  const limit = query.limit || 10;
  const paginator = query.p || 1;
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
    .limit(limit)
    .offset((paginator - 1) * limit)
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

exports.insertNewArticle = body => {
  return connection
    .insert(body)
    .into('articles')
    .returning('*')
    .then(insertedArticle => {
      return insertedArticle;
    });
};
