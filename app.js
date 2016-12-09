var express = require('express');
var update = require(__dirname + '/update.js');
var compression    = require('compression');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var app = express();

app.use(compression());
app.use(methodOverride());  // simulate DELETE and PUT
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static((path.join(__dirname, 'public'))));
app.listen(1339, function () {
  console.log('App runnung on port 1339');
  setInterval(function(){update.update()},5000);
});


app.get('/', function(req, res){
   fs.readFile(__dirname + '/public/index.html', 'utf-8', function (err, data){
      res.send(data);
   });
});


app.get('/data', function(req, res){
   var data = require(__dirname + '/data.js');
   data.get(function(output){
      res.send(output);
   });
});