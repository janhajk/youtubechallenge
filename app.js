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
            console.log((err ? err.message : callback(null, {id:rows[i].yid, stats:stats.items[0].statistics)};));
         });
      });
   }
   async.parallel(videos, function(err, results) {
      console.log(results);
   })
});

connection.end();





async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});


