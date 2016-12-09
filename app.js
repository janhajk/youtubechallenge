var express = require('express')
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(1339, function () {
  console.log('App runnung on port 1339');
  setInterval(function(){
     require(__dirname + '/config.js');
  },1000);
});