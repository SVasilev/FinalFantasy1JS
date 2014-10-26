var express = require('./lib/node_modules/express'),
	app     = express(),
	port    = process.env.PORT || 8080;

//Queries to database are made through http://localhost:8080/services/<backendFile>.js
app.get(/.*services\/(.+)\.js.*/, function(request, response) {
	var servicePath = './services/' + request.params[0] + '.js';
	var service = require(servicePath);
	//alert(request.query.cmd);
	//response.end(JSON.stringify(request.query));
	service.executeCommand(request, response);
});

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/'));

app.listen(port);
console.log('Magic happens on port ' + port);
