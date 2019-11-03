exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  // if (err.status) res.status(err.status).send({ msg: messageSplitter(err) });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  // // console.log(err);
  // const psqlError2 = {
  //   '22P02': {
  //     status: 400,
  //     msg: messageSplitter(err)
  //   },
  //   '23502': {
  //     status: 400,
  //     msg: messageSplitter(err)
  //   },
  //   '23503': {
  //     status: 400,
  //     msg: messageSplitter(err)
  //   },
  //   '42703': {
  //     status: 400,
  //     msg: messageSplitter(err)
  //   },
  //   '42P01': {
  //     status: 400,
  //     msg: messageSplitter(err)
  //   }
  // };
  // if (err.code)
  //   res
  //     .status(psqlError2[err.code].status)
  //     .send({ msg: psqlError2[err.code].msg });
  // else next(err);
  if (err.code === '23503') {
    res.status(404).send({ msg: `${err.code} ${err.detail}` });
  }
  const psqlErrors = ['22P02', '42P01', '23502', '42703'];
  if (psqlErrors.includes(err.code)) {
    res.status(400).send({ msg: `${err.code} database error` });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send('server error');
};

exports.send405error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};

exports.messageSplitter = err => {
  const msg = err.message.split(' - ')[1];
  return msg;
};
