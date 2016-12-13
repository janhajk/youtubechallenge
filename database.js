var config = require(__dirname + '/config.js');


var getVideos = function(connection, callback) {
   connection.query('SELECT * FROM videos', function(err, rows) {
      if(err) {
         if (config.dev) console.log(err);
         callback(err);
      }
      else {
         if(config.dev) console.log(rows);
         callback(null, rows);
      }
   });
};
exports.getVideos = getVideos;


var updateStats = function(stats, connection, callback) {
   var insert = [];
   for (let i in stats) {
      insert.push('('+stats[i].statistics.id+','+stats[i].statistics.ViewCount+','+Math.floor(Date.now() / 1000)+')');
   }
   var query = 'INSERT INTO stats (yid, viewCount, timestamp) VALUES ' + insert.join(',');
   if (config.dev) console.log(query);
   connection.query(query, function(err) {
      if(err) {
         callback(err);
      }
      else {
         callback(null);
      }
   });
};
exports.updateStats = updateStats;