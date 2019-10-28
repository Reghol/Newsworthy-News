const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics_controller');

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
