const connection = require('../../connection');

exports.checkIfArticleExists = article_id => {
  return connection
    .select('*')
    .from('articles')
    .where({ article_id })
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }

      return true;
    });
};
