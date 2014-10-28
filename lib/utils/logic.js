module.exports = {
	isValidEmail: function(email) {
		var emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegularExpression.test(email);
	},
	findUserWithProperty: function(array, value, property) {
		for(var i = 0; i < array.length; i++) {
			if(array[i][property] === value) return array[i];
		}
		return false;
	},
	generateRandomSalt: function() {
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
			salt     = "",
			SALT_LEN = 12;

	    for(var i = 0; i < SALT_LEN; i++) 
	    	salt += possible.charAt(Math.floor(Math.random() * possible.length));

	    return salt;
	}
};