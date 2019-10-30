const { fetchJSON } = require('../models/fetch_json.js');

exports.jsonRoutes = (req, res, next) => {
  fetchJSON()
    .then(json => {
      res.status(200).send({ json });
    })
    .catch(next);
};
