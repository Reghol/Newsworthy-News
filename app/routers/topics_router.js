const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics_controller');
const { send405error } = require('../errors');
topicsRouter
  .route('/')
  .get(getTopics)
  .all(send405error);

module.exports = topicsRouter;
