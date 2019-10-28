const connection = require('../../connection');

exports.selectUser = username => {
  return connection
    .select('username', 'name', 'avatar_url')
    .from('users')
    .where({ username })
    .then(user => {
      if (!user.length)
        return Promise.reject({
          status: 404,
          msg: 'username not found'
        });
      return user;
    });
};
