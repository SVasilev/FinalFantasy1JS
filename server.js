var session = require('express-session');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var loginService = require('./services/login/login');
var saveLoadService = require('./services/saveload');

app.use('/', express.static(__dirname + '/web', { 'index': ['index.html'] }));
app.use('/src', express.static(__dirname + '/src'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false, // Disable saving session by default for login purposes
  cookie: { maxAge: 2 * 60 * 60000 } // 2 hours
}));

app.get('/services/login', loginService);
app.get('/services/game/save', saveLoadService.save);
app.get('/services/game/load', saveLoadService.load);

app.use(function continueIfUserIsRegistered(req, res, next) {
  if (req.session.userID) {
    return next();
  }
  res.send('');
});

app.get('/session/info', function(req, res) {
  res.json(req.session);
});

app.listen(port);
console.log('Magic happens on port ' + port); // eslint-disable-line no-console
