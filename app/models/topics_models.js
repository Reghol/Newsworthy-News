const connection = require('../../connection');

exports.selectTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .then(topicsData => {
      return topicsData;
    });
};
