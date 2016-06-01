var mysql = require('mysql');
var assert = require('assert');
var loginUtils = require('../../../../services/login/utils');
var loginService = require('../../../../services/login/login');

var connection;
var response = [];
var randomEmail = loginUtils.generateRandomSalt() + '@abv.bg';
var res = {
  end: function(message) {
    response[0] = message;
  }
};

function executeSingleQuery(query, callback) {
  connection.query(query, function(error) {
    if (error) {
      throw error;
    }
    callback && callback();
  });
}

function getRequestObjectWithEmailAndPassword(email, password) {
  return {
    session: {},
    query: {
      email: email,
      password: password
    }
  };
}

function waitDatabaseResponseAndAssert(expectedResponse, done) {
  setTimeout(function() {
    if (response[0] !== '') {
      assert.equal(response[0], expectedResponse);
      done();
    }
    else {
      // Obviously the database connection is slow, so wait 1 second more.
      setTimeout(function() {
        assert.equal(response[0], expectedResponse);
        done();
      }, 1000);
    }
  }, 40);
}

describe('login service', function() {
  before(function(done) {
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'goshko',
      database : 'ff1'
    });
    // Fill the table with a dummy record.
    executeSingleQuery('INSERT INTO `user` VALUES' +
      '(1,\'R0t12zp11mT3rpermfs@abv.bg\',\'ZrOD9STp4oiq\',\'22396be4d3b7e4c08b820895cdb40422\',\'2015-09-27 02:18:03\');',done);
  });

  after(function(done) {
    executeSingleQuery('DELETE FROM user WHERE ID = 1 or email = \'' + randomEmail + '\';', done);
  });

  beforeEach(function() {
    response[0] = '';
  });

  it('should find the user by his email and should log him in', function(done) {
    var req = getRequestObjectWithEmailAndPassword('R0t12zp11mT3rpermfs@abv.bg', 'pipidalgotochorapche');
    loginService(req, res);
    waitDatabaseResponseAndAssert('Logged in.', done);
  });

  it('should log that the user exists or the password is incorrect', function(done) {
    var req = getRequestObjectWithEmailAndPassword('R0t12zp11mT3rpermfs@abv.bg', 'wrongpassword');
    loginService(req, res);
    waitDatabaseResponseAndAssert('User already exists or incorrect password.', done);
  });

  it('should create new user if the email was not found in the database', function(done) {
    var req = getRequestObjectWithEmailAndPassword(randomEmail, '123456');
    loginService(req, res);
    waitDatabaseResponseAndAssert('User created.', done);
  });
});
