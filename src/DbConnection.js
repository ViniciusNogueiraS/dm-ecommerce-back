class Db {
  mysql = '';
  con = '';

  constructor() {
    Object.assign(this);
  }

  getConnection(){
    var mysql = require('mysql');
    var con = mysql.createConnection({
      host     : "localhost",
      user     : "root",
      password : "123",
      database : "ecommerce",
      port     : "3306"
    });

    con.connect(function(err) {
      if (err) throw err;
      console.log("MySQL Connected!");
    });
    return con;
  }
}
var db = new Db();
module.exports = db;
