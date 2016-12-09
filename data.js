var mysql = require('mysql');
var config = require(__dirname + '/config.js');

var connection = mysql.createConnection({
  host: 'localhost',
  user: config.sql.user,
  password: config.sql.password,
  database: 'youtube'
});

exports.get = function(callback){
   connection.query('SELECT * FROM stats', function(err, rows1) {
      if(err) throw err;
      console.log(rows1);
      connection.query('SELECT * FROM videos', function(err,rows2){
         if(err) throw err;
         var videos = {};
         for (let i in rows2) {
            videos[rows2[i].id] = rows2[i];
         }
         console.log(rows2);
         callback({stats:rows1, videos:videos});
      });
   });
};

