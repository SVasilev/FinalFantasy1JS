var utils = require('../lib/utils/logic.js'),
	mysql = require('../lib/node_modules/mysql'),
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'Sopata',
		password : 'goshko',
		database : 'ff1'
	});

module.exports = {
	invalidCommand: function() {
		response.end("Invalid Command");
	},
	registerUser: function (request, response) {
		connection.query('SELECT * FROM user', function(error, rows, fields) {
			if(error) throw error;
			if(utils.emailExists(rows, request.query.email.toString())) response.end("User already exists.");
			else
			{
				var post = { 
					email: request.query.email.toString(),
					password: request.query.password.toString(), //TODO Make it with CryptoJS
					salt: utils.generateRandomSalt(), 
					created: new Date()
				};
				connection.query("INSERT INTO USER SET ?", post, function(error, rows, fields) {
					if(error) throw error;
					response.end("User created.");
				});
			}
		});
	},
	executeCommand: function(request, response) {
		switch (request.query.cmd) {
		case 'registerUser':
			this.registerUser(request, response);
			break;
		default:
			this.invalidCommand();
			break;
		}
	}
};