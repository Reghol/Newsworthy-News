const connection = require('../../connection');
const fs = require('fs');
exports.fetchJSON = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('endpoints.json', (err, json) => {
      if (err) reject(err);
      resolve(JSON.parse(json));
    });
  });
};
