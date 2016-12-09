var google = require('googleapis');
var Youtube = google.youtube('v3');
var mysql = require('mysql');
var config = require(__dirname + '/config.js');
var async = require('async');
google.options({ auth: config.api_key });

var connection = mysql.createConnection({
  host: 'localhost',
  user: config.sql.user,
  password: config.sql.password,
  database: 'youtube'
});

connection.connect();



connection.query('SELECT * FROM videos', function(err, rows, fields) {
   if(err) throw err;
   console.log(rows);
   var videos = [];
   for(let i in rows) {
      videos.push(function(callback) {
         Youtube.videos.list({
            part: 'statistics',
            id: rows[i].yid
         }, function(err, stats) {
            console.log((err ? err.message : callback(null, {id:rows[i].id, stats:stats.items[0].statistics})));
         });
      });
   }
   async.parallel(videos, function(err, results) {
      console.log(results);
      var query = 'BEGIN;';
      for (let i in results){
        query += 'INSERT INTO stats (vid, viewCount,timestamp) VALUES ('+results[i].id+', '+results[i].stats.viewCount+', '+Date.now()+');';
      }
      query += 'COMMIT;';
      connection.query(query, function(err, rows, fields) {
         if (err) throw err;

         console.log('New Rows written');
         connection.end();
      });
   });
});


