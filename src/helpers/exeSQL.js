const db = require('../DbConnection.js');

function executeSQL(sql, callback){
    var con = db.getConnection();
    con.query(sql, function(err, result, fields) {
        if(err) {
            throw err;
        }else {
            if (callback) {
                callback(result);
            }
        }
    })
}
module.exports = executeSQL;