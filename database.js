var config = require(__dirname + '/config.js');


var getVideos = function(fid, connection, callback) {
   var q = 'SELECT * FROM videos';
   if(fid !== 'all') {
      fid = parseInt(rid, 10);
      q += ' WHERE rid = ' + fid;
   }
   if (config.dev) console.log(q);
   connection.query(q, function(err, rows) {
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

var getFight = function(fid, connection, callback){
   if(!shortid.isValid(fid)) {
      callback(fid + ' is not a valid ID');
      if (config.dev) console.log(fid + ' is not a valid ID');
      return;
   }
   var q = 'SELECT * FROM fights WHERE fid = "' + fid + '"';
   if (config.dev) console.log(q);
   connection.query(q, function(err, rows) {
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
exports.getFight = getFight;


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