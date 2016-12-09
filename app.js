var google = require('googleapis');
var Youtube = google.youtube('v3');



var API_KEY = 'AIzaSyAQ2Hs4P-sMGzeH82QMrZYnVBGQfZl62Rw'; // specify your API key here
google.options({ auth: API_KEY });
Youtube.videos.list({
   part: 'statistics',
   id: 'JnS8qePSv90'
}, function (err, stats){
   console.log((err ? err.message : stats));
});
