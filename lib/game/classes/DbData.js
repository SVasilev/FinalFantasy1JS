/* global $ */

function DbData() {
  this._setPropertyFromTable('items', 'item');
  this._setPropertyFromTable('questItems', 'questitem');
  this._setPropertyFromTable('armors', 'armor');
  this._setPropertyFromTable('weapons', 'weapon');
  this._setPropertyFromTable('spells', 'spell');
  this._setPropertyFromTable('monsters', 'monster');
  this._setPropertyFromTable('battlebackgrounds', 'battlebackgrounds');
}

// Get data from tha database.
DbData.prototype._setPropertyFromTable = function(property, tableName) {
  $.ajax({
    context: this,
    async: false,
    url: '/services/persist?tableName=' + tableName,
    success: function(response) {
      this[property] = response;
    },
    error: function(response) {
      alert(response.responseText);
    }
  });
};
