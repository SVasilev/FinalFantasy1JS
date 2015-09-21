var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var loginService = require('./lib/services/login/login');

app.get('/services/login', loginService);

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/'));

app.listen(port);
console.log('Magic happens on port ' + port);
