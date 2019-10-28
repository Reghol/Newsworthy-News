const express = require('express');
const apiRouter = require('./routers/api_routers');
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({
    err: "Ain't such route round these parts partner"
  });
});

module.exports = app;
