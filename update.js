var google = require('googleapis');
var Youtube = google.youtube('v3');
var config = require(__dirname + '/config.js');
var async = require('async');


var update = function(mysqlconnection, cb){
   google.options({ auth: config.api_key });
   mysqlconnection.query('SELECT * FROM videos', function(err, rows, fields) {
      if(err) throw err;
      console.log(rows);
      var videos = [];
      for (let i in rows) {
         videos.push(function(callback) {
            Youtube.videos.list({
               part: 'statistics',
               id: rows[i].yid
            }, function(err, stats) {
               console.log((err ? err.message : callback(null, {
                  id: rows[i].id,
                  stats: stats.items[0].statistics
               })));
            });
         });
      }
      async.parallel(videos, function(err, results) {
         console.log(results);
         var queries = [];
         for(let i in results) {
            queries.push(function(callback) {
               let query = 'INSERT INTO stats (vid, viewCount,timestamp) VALUES (' + results[i].id + ', ' + results[i].stats.viewCount + ', ' + Math.floor(Date.now() / 1000) + ');';
               mysqlconnection.query(query, function(err, rows, fields) {
                  if(err) throw err;
                  callback(null);
               });
            });
         }
         async.parallel(queries, function(err){
            cb('everything updated!');
            console.log('everything updated!');
         });
      });
   });
};
exports.update = update;


var update2 = function(connection, callback) {
   var database = require(__dirname + '/database.js');
   var youtube = require(__dirname + '/youtube.js');
   database.getVideos(connection, function(err, rows){
      if (err) {
         if (config.dev) console.log(err);
         callback(err);
      }
      else {
         let vids;
         for (let i in rows) {
            vids.push(rows[i].yid);
         }
         youtube.getStats(vids, function(err, stats) {
            updateStats(stats, connection, function(err){
               callback(err, 'Stats updated!');
            });
         });
      }
   });
};
exports.update2 = update2;