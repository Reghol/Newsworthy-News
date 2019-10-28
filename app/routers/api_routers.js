const apiRouter = require('express').Router();
const topicsRouter = require('./topics_router');
const usersRouter = require('./users_router');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
