const {
  getUser,
  getUsers,
  postUser
} = require('../controllers/users_controller');
const { send405error } = require('../errors');
const usersRouter = require('express').Router();

usersRouter
  .route('/')
  .get(getUsers)
  .post(postUser)
  .all(send405error);

usersRouter
  .route('/:username')
  .get(getUser)
  .all(send405error);

//get post allowed
//delete & put not allowed
//

module.exports = usersRouter;
