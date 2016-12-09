var google = require('googleapis');
var Youtube = google.youtube('v3');
var mysql = require('mysql');
var config = require(__dirname + '/config.js');

var connection = mysql.createConnection({
  host: 'localhost',
  user: config.sql.user,
  password: config.sql.password
});

connection.connect();



connection.query('SELECT * FROM videos', function(err, rows, fields) {
  if (err) throw err;
  console.log(rows);
});

connection.end();

var API_KEY = config.api_key; // specify your API key here
google.options({ auth: API_KEY });
Youtube.videos.list({
   part: 'statistics',
   id: 'JnS8qePSv90'
}, function (err, stats){
   console.log((err ? err.message : stats.items[0].statistics));
});


