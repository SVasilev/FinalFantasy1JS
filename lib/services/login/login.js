'use strict';

var	crypto = require('crypto');
var mysql = require('mysql');
var utils = require('./utils');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'goshko',
  database : 'ff1'
});

module.exports = function(req, res) {
  var userEmail = req.query.email.toString();
  var userPassword = req.query.password.toString();

  connection.query('SELECT * FROM user', function(error, rows, fields) { // eslint-disable-line no-unused-vars
    if (error) {
      console.log(error);
      return res.status(500).end('Internal server error');
    }
    var md5 = crypto.createHash('md5');
    var currentUser = utils.findUserWithProperty(rows, userEmail, 'email');
    if (currentUser) {
      if (md5.update(currentUser.salt + userPassword).digest('hex') === currentUser.password.toString()) {
        req.session.userID = currentUser.ID;
        res.end('Logged in.');
      }
      else {
        res.end('User already exists or incorrect password.');
      }
    }
    else
    {
      var generatedSalt = utils.generateRandomSalt();
      var batch = {
        email: userEmail,
        salt: generatedSalt,
        password: md5.update(generatedSalt + userPassword).digest('hex'),
        created: new Date()
      };
      connection.query('INSERT INTO USER SET ?', batch, function(error, rows, fields) { // eslint-disable-line no-unused-vars
        if (error) {
          console.log(error);
          return res.status(500).end('Internal server error');
        }
        res.end('User created.');
      });
    }
  });
};
