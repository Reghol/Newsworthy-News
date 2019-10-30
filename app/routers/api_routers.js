const apiRouter = require('express').Router();
const topicsRouter = require('./topics_router');
const usersRouter = require('./users_router');
const articlesRouter = require('./articles_router');
const commentsRouter = require('./comments_router');
const { jsonRoutes } = require('../controllers/jsonController');
const { send405error } = require('../errors');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter
  .route('/')
  .get(jsonRoutes)
  .all(send405error);
module.exports = apiRouter;
