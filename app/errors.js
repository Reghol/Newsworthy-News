exports.messageSplitter = err => {
  return err.message.split(' - ');
};
exports.customErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  // messageSplitter(err);
  if (err.code === '23503') {
    res.status(404).send({ msg: `${err.code} ${err.detail}` });
  }

  const psqlErrors = ['22P02', '42P01', '23502', '42703'];

  if (psqlErrors.includes(err.code)) {
    res.status(400).send({ msg: `${err.code} database error` });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send('server error');
};

exports.send405error = (req, res, next) => {
  // console.log(req);
  res.status(405).send({ msg: 'method not allowed' });
};
