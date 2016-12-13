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
   if (config.dev) console.log(stats);
   var insert = [];
   for (let i in stats) {
      let p = [];
      p.push("'" + stats[i].id + "'");
      p.push(stats[i].statistics.viewCount);
      p.push(Math.floor(Date.now() / 1000));
      insert.push('('+p.join(',')+')');
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