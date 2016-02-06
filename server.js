var session = require('express-session');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var loginService = require('./lib/services/login/login');
var dbPersistService = require('./lib/services/persist/queries');

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false, // Disable saving session by default for login purposes
  cookie: { maxAge: 2 * 60 * 60000 } // 2 hours
}));

app.get('/services/login', loginService);
app.get('/services/persist', dbPersistService);

app.use(function continueIfUserIsRegistered(req, res, next) {
  if (req.session.userID) {
    return next();
  }
  res.send('');
});

app.get('/session/info', function(req, res, next) {
  res.json(req.session);
});

app.listen(port);
console.log('Magic happens on port ' + port);
