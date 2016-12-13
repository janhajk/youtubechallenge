var config = require(__dirname + '/config.js');
var google = require('googleapis');
var Youtube = google.youtube('v3');
google.options({ auth: config.api_key });

/*
stats.items looks like this:
[
  {
   "kind": "youtube#video",
   "etag": "\"gMxXHe-zinKdE9lTnzKu8vjcmDI/nailX_s_E4qttPaUGNvpa3TVw30\"",
   "id": "JnS8qePSv90",
   "statistics": {
    "viewCount": "61",
    "likeCount": "2",
    "dislikeCount": "0",
    "favoriteCount": "0",
    "commentCount": "0"
   }
  }
 ]
*/
var getStats = function(vids, callback) {
   Youtube.videos.list({
      part: 'statistics',
      id: vids.join(',')
   }, function(err, stats) {
      if (err) {
         if (config.dev) console.log(err);
         callback(err);
      }
      else {
         if (config.dev) console.log(stats);
         callback(null, stats.items);
      }
   });
};
exports.getStats = getStats;