/* global $, document, loginUtils */

$(document).ready(function() {
  var userIsLogged = !!loginUtils.getSessionInfo();

  // Hide login form if user is logged.
  if (userIsLogged) {
    $('#login').css('opacity', 0);
  }
});
