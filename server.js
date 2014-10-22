var express = require('./lib/node_modules/express'),
	app     = express(),
	port    = process.env.PORT || 8080;

//Queries to database are made through http://localhost:8080/services/<backendFile>.js
app.get(/.*services\/(.+)\.js.*/, function(req, res) {
	var servicePath = './services/' + req.params[0] + '.js';
	service = require(servicePath);
	res.end(JSON.stringify(service.executeCommand(req.query)));
});

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/'));

app.listen(port);
console.log('Magic happens on port ' + port);
