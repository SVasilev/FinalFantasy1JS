'use strict';

module.exports = {
  findUserWithProperty: function(array, value, property) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][property] === value) {
        return array[i];
      }
    }
    return null;
  },

  generateRandomSalt: function() {
    var salt = '';
    var SALT_LENGTH = 12;
    var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < SALT_LENGTH; i++) {
      salt += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }
    return salt;
  }
};