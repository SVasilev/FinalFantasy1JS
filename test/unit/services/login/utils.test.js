var assert = require('assert');
var loginUtils = require('../../../../services/login/utils');

describe('loginUtils module', function() {
  describe('findUserWithProperty function', function() {
    it('should return null if user cannot be found', function() {
      var array = [{ id: '16', email: 'petran@abv.bg' }, { id: '18', email: 'peshko@abv.bg' }];
      var user = loginUtils.findUserWithProperty(array, 'peshkoo@abv.bg', 'email');
      assert.equal(user, null);
    });

    it('should find user by given property', function() {
      var array = [{ id: '16', email: 'petran@abv.bg' }, { id: '18', email: 'peshko@abv.bg' }];
      var user = loginUtils.findUserWithProperty(array, 'peshko@abv.bg', 'email');
      assert.equal(user.id, '18');
      user =loginUtils.findUserWithProperty(array, '16', 'id');
      assert.equal(user.email, 'petran@abv.bg');
    });
  });

  describe('generateRandomSalt function', function() {
    it('should generate random salt', function() {
      var SALT_LENGTH = 12;
      var salt = loginUtils.generateRandomSalt();
      var otherSalt = loginUtils.generateRandomSalt();

      assert.equal(salt.length, SALT_LENGTH);
      assert.equal(otherSalt.length, SALT_LENGTH);
      // This may fail once in 62^12 cases.
      assert(salt !== otherSalt);
    });
  });
});
