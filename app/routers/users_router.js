const { getUser } = require('../controllers/users_controller');

const usersRouter = require('express').Router();

usersRouter.route('/').get();

usersRouter.route('/:username').get(getUser);

module.exports = usersRouter;
