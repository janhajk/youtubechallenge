var google = require('googleapis');
var Youtube = google.youtube('v3');
var config = require(__dirname + '/config.js');


var update = function(connection, callback) {
   var database = require(__dirname + '/database.js');
   var youtube = require(__dirname + '/youtube.js');
   database.getVideosforUpdate(connection, function(err, rows){
      if (err) {
         if (config.dev) console.log(err);
         callback(err);
      }
      else {
         let vids = [];
         for (let i in rows) {
            vids.push(rows[i].yid);
         }
         // TODO: Check if the view Count has changed; only update if it has to save space for videos that are not changing very often
         youtube.getStats(vids, function(err, stats) {
            database.updateStats(stats, connection, function(err){
               callback(err, 'Stats updated!');
            });
         });
      }
   });
};
exports.update = update;