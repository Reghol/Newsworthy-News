exports.customErrors = (err, req, res, next) => {
  // console.log(error);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  // console.log(err);
  const psqlErrors = ['22P02', '42P01'];

  if (psqlErrors.includes(err.code)) {
    res.status(400).send({ msg: `${err.code} database error` });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send('server error');
};
