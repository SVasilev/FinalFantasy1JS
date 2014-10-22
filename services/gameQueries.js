var mysql = require('../lib/node_modules/mysql'),
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'Sopata',
		password : 'goshko',
		port	 : 3306,
		database : 'ff1',
		debug 	 : true,
	});

	

module.exports = {
	checkUser: function checkUser(requestParameters) {
		connection.connect(function(err) {
		  if ( !err ) {
		    console.log("Connected to MySQL");
		  } else if ( err ) {
		    console.log(err);
		  }
		});

		var result = "";
		connection.query('SELECT * FROM user', function(err, rows, fields) {
			//if (err) throw err;
			//result = 'The solution is: ' + rows[0].id + 41;
			//console.log('The solution is: ', rows[0].id);
			return rows[0].id;
		});

		
		connection.end();
		return result;
	},
	
	executeCommand: function(requestParameters) {
		switch (requestParameters.cmd) {
		case 'blabla':
			return this.checkUser(requestParameters);
			break;

		default:
			return "Invalid command!";
			break;
		}
	}
};