const db = require('../DbConnection.js');

function executeSQL(sql){
  return new Promise((resolve, reject) => {
    var con = db.getConnection();
    con.query(sql, function(err, result, fields) {
      if (err) reject(err);
      else resolve(result);
    })
  });
}
module.exports = executeSQL;