var express = require('express');
var update = require(__dirname + '/update.js');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(1339, function () {
  console.log('App runnung on port 1339');
  setInterval(update.update(),1000);
});