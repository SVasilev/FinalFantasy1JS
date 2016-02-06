var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'goshko',
  database : 'ff1'
});

module.exports = function selectAllFromTable(req, res) {
  var tableName = req.query.tableName;

  connection.query('SELECT * FROM ' + tableName, function(error, rows, fields) { // eslint-disable-line no-unused-vars
    if (error) {
      return res.status(500).end('Internal server error');
    }
    res.json(rows);
  });
};
