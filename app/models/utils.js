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
const checkIfAuthorExists = author => {
  return connection
    .select('*')
    .from('users')
    .where({ username: author })
    .then(authors => {
      if (!authors.length) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      }
      return true;
    });
};
