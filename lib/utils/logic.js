module.exports = {
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