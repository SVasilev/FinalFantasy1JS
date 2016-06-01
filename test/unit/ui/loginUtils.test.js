var fs = require('fs');
var assert = require('assert');
// Require loginUtils.
eval(fs.readFileSync(__dirname + '../../../../web/js/ui/loginUtils.js').toString());

var document;
var result = '';
var $ = {
  ajax: function(options) {
    result = options.url;
  }
};

// This function gets overriden because we won't test it.
loginUtils.fadeOut = function(element, message) {
  result = message;
};

function setEmailAndPassword(email, password) {
  document = {
    getElementById: function(element) {
      if (element === 'email') {
        return { value: email };
      }
      return { value: password };
    }
  };
}

describe('UI loginUtils module', function() {
  describe('executeQuery function', function() {
    it('should calls backend login service with correct url', function() {
      loginUtils.executeQuery('/services/login?email=gg@abv.bg&password=1234');
      assert.equal(result, '/services/login?email=gg@abv.bg&password=1234');
    });
  });

  describe('isValidEmail function', function() {
    it('validates a proper email address', function() {
      assert.equal(loginUtils.isValidEmail('dimgfdl1mdkfn@dds.asd'), true);
    });

    it('detects invalid email address', function() {
      assert.equal(loginUtils.isValidEmail('dimgfdl1mdkfndds.asd@m'), false);
    });
  });

  describe('loginOrRegister function', function() {
    it('It warns to fill all the fields if user or password field is empty', function() {
      setEmailAndPassword(undefined, '123456');
      loginUtils.loginOrRegister();
      assert.equal(result, 'Please fill the fields.');
      setEmailAndPassword('asd@abv.bg', undefined);
      loginUtils.loginOrRegister();
      assert.equal(result, 'Please fill the fields.');
      setEmailAndPassword(undefined, undefined);
      loginUtils.loginOrRegister();
      assert.equal(result, 'Please fill the fields.');
    });

    it('It warns if provided email is invalid', function() {
      setEmailAndPassword('asd.d@m', '123456');
      loginUtils.loginOrRegister();
      assert.equal(result, 'Invalid email.');
    });

    it('It calls the backend if the input is OK', function() {
      setEmailAndPassword('asd@dsa.bg', '123456');
      loginUtils.loginOrRegister();
      assert.equal(result, '/services/login?email=asd@dsa.bg&password=123456');
    });
  });
});