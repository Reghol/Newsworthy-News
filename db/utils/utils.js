exports.formatDates = list => {
  const mappedList = list.map(item => {
    let newList = { ...item };
    newList.created_at = new Date(newList.created_at);
    return newList;
  });
  return mappedList;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
