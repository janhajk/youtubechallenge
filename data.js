var config = require(__dirname + '/config.js');

exports.get = function(mysqlconnection, callback){
   mysqlconnection.query('SELECT * FROM stats ORDER BY timestamp DESC', function(err, rowsStats) {
      if(err) throw err;
      console.log(rowsStats);
      mysqlconnection.query('SELECT * FROM videos', function(err,rowsVideos){
         if(err) throw err;
         var videos = {};
         for (let i in rowsVideos) {
            videos[rowsVideos[i].id] = rowsVideos[i];
         }
         console.log(rowsVideos);
         callback({stats:rowsStats, videos:videos});
      });
   });
};

