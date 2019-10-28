exports.formatDates = list => {
  const mappedList = list.map(item => {
    let newList = { ...item };
    newList.created_at = new Date(newList.created_at);
    return newList;
  });
  return mappedList;
};

exports.makeRefObj = (list, key, value) => {
  return list.reduce((refObj, currentValue) => {
    refObj[currentValue[key]] = currentValue[value];
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    let newObj = { ...comment };
    newObj.author = comment.created_by;
    delete newObj.created_by;

    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;

    newObj.created_at = new Date(newObj.created_at);

    return newObj;
  });
};
