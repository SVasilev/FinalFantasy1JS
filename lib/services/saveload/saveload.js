'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'goshko',
  database : 'ff1'
});

module.exports = {
  save: function(req, res) {
    if (req.session.userID) {
      var saveData = req.query.saveData || '';
      var batch = {
        ID: req.session.userID,
        data: saveData,
        created: new Date()
      };

      connection.query('DELETE FROM SAVEGAME WHERE ID = ' + req.session.userID, function(error, rows, fields) { // eslint-disable-line no-unused-vars
        if (error) {
          console.log(error);
          return res.status(500).end('Internal server error');
        }
      });

      connection.query('INSERT INTO SAVEGAME SET ?', batch, function(error, rows, fields) { // eslint-disable-line no-unused-vars
        if (error) {
          console.log(error);
          return res.status(500).end('Internal server error');
        }
        res.end('Game saved.');
      });
    }
    else {
      res.end('You have to be logged in in order to save your game.');
    }
  },

  load: function(req, res) {
    connection.query('SELECT DATA FROM SAVEGAME WHERE ID = ' + req.session.userID, function(error, rows, fields) { // eslint-disable-line no-unused-vars
      if (error) {
        console.log(error);
        return res.status(500).end('Internal server error');
      }
      res.end(rows[0].DATA);
    });
  }
};
