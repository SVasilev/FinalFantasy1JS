/* global $ */

function DbData() {
  this.setPropertyFromTable('items', 'item');
  this.setPropertyFromTable('questItems', 'questitem');
  this.setPropertyFromTable('armors', 'armor');
  this.setPropertyFromTable('weapons', 'weapon');
  this.setPropertyFromTable('spells', 'spell');
  this.setPropertyFromTable('monsters', 'monster');
  this.setPropertyFromTable('battlebackgrounds', 'battlebackgrounds');
}

// Get data from tha database.
DbData.prototype.setPropertyFromTable = function(property, tableName) {
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
