var config = require(__dirname + '/config.js');
var database = require(__dirname + '/database.js');
var shortid = require('shortid');

var get = function(fid, mysqlconnection, callback){
   if(!shortid.isValid(fid)) {
      callback(fid + ' is not a valid ID');
      if (config.dev) console.log(fid + ' is not a valid ID');
      return;
   }
   // get from fight all stats
   let cols = ['stats.yid', 'stats.viewCount', 'stats.timestamp'];
   let joins = [
      'RIGHT JOIN vidstats ON (fights.fid = vidstats.fid)',
      'LEFT JOIN  videos   ON (vidstats.yid = videos.yid)',
      'RIGHT JOIN stats    ON (stats.yid = videos.yid)'];
   let where = ' WHERE fights.fid = "' + fid + '"';
   let q = 'SELECT ' + cols.join(',') + ' FROM fights ' + joins.join(' ') + where;
   mysqlconnection.query(q, function(err, rowsStats) {
      if(err) throw err;
      console.log(rowsStats);
      database.getVideos(fid, mysqlconnection, function(err, rows){
         if(err) {
            console.log(err);
            callback(err);
         }
         else {
            if (config.dev) console.log(rows);
            let videos = {};
            for (let i in rows) {
               videos[rows[i].yid] = rows[i];
            }
            callback(null, {stats:rowsStats, videos:videos});
         }
      });
   });
};
exports.get = get;
