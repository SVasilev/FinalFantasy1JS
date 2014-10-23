var express = require('./lib/node_modules/express'),
	app     = express(),
	port    = process.env.PORT || 8080;

//Queries to database are made through http://localhost:8080/services/<backendFile>.js
app.get(/.*services\/(.+)\.js.*/, function(request, resesponse) {
	var servicePath = './services/' + request.params[0] + '.js';
	var service = require(servicePath);
	service.executeCommand(request, resesponse);
});

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/'));

app.listen(port);
console.log('Magic happens on port ' + port);
