const {
  selectUser,
  selectUsers,
  insertNewUser
} = require('../models/users_model');

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users: users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { body } = req;
  insertNewUser(body).then(user => {
    res.status(200).send({ user: user[0] });
  });
};
