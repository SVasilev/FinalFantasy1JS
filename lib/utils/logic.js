module.exports = {
	emailExists: function(array, value) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].email === value) return true;
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