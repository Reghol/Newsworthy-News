const { getUser } = require('../controllers/users_controller');
const { send405error } = require('../errors');
const usersRouter = require('express').Router();

usersRouter.route('/').all(send405error);

usersRouter.route('/:username').get(getUser);

//get post allowed
//delete & put not allowed
//

module.exports = usersRouter;
