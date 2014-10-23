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
	checkUserExistance: function checkUserExistance(request, response) {
		//alert("asd");
		connection.query('SELECT * FROM user', function(error, rows, fields) {
			if(error) throw error;
			//res.end(reqest.query.cmd.toString());
			
			//res.end("asd");
			/*if(request.query.email == rows[0].email.toString())
			{
				response.end("Exist");
			}
			else
			{
				response.end("Doesnt exist");
			}*/
		});
	},
	executeCommand: function(request, response) {
		switch (request.query.cmd) {
		case 'checkUserExistance':
			this.checkUserExistance(request, response);
			break;
		default:
			this.invalidCommand();
			break;
		}
	}
};