var mysql = require('mysql');
var config = require(__dirname + '/config.js');

var connection = mysql.createConnection({
  host: 'localhost',
  user: config.sql.user,
  password: config.sql.password,
  database: 'youtube'
});

exports.get = function(callback){
   connection.query('SELECT * FROM stats', function(err, rows, fields) {
      if(err) throw err;
      console.log(rows);
      callback(rows);
   });
};

