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
