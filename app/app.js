const express = require("express");
const apiRouter = require("./routers/api_routers");
const app = express();
const cors = require("cors");
const { customErrors, psqlErrors, serverErrors } = require("./errors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

app.all("/*", (req, res, next) => {
  res.status(404).send({
    err: "Ain't such route round these parts partner"
  });
});
module.exports = app;
