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
exports.selectUsers = () => {
  return connection
    .select('*')
    .from('users')
    .then(users => {
      return users;
    });
};

exports.insertNewUser = body => {
  return connection
    .insert(body)
    .into('users')
    .returning('*')
    .then(insertedUser => {
      return insertedUser;
    });
};
