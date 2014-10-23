var mysql = require('../lib/node_modules/mysql'),
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'Sopata',
		password : 'goshko',
		database : 'ff1'
	});

module.exports = {
	invalidCommand: function invalidCommand() {
		response.end("Invalid Command");
	},
	checkUser: function checkUser(request, response) {
		connection.query('SELECT * FROM user', function(error, rows, fields) {
			if(error) throw error;
			response.end(rows[0].email.toString());
		});
	},
	executeCommand: function(request, response) {
		switch (request.query.cmd) {
		case 'blabla':
			this.checkUser(request, response);
			break;

		default:
			this.invalidCommand();
			break;
		}
	}
};