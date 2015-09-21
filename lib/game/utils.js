/* global $ */

var utils = { // eslint-disable-line no-unused-vars
  loadJSON: function(fileLocation) {
    var jsonData;
    $.ajaxSetup({ async: false });
    $.getJSON(fileLocation, function(data) {
      jsonData = data.tiles;
    });
    $.ajaxSetup({ async: true });
    return jsonData;
  },

  require: function(fileLocation) {
    $.ajaxSetup({ async: false });
    $.getScript(fileLocation)
      .done(function(script) {
        eval(script);
      })
      .fail(function(jqxhr, settings, exception) {
        console.log('Error with message \'' + exception + '\' occured while loading file: ' + fileLocation);
      });
    $.ajaxSetup({ async: true });
  }
};
