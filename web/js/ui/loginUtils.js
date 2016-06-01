/* global window document alert $ */

var loginUtils = { // eslint-disable-line no-unused-vars
  fadeOut: function(elementID, newText) {
    var paragraph = document.getElementById(elementID);
    var opacity = 1;

    if (paragraph.innerHTML.length < 10 || elementID === 'login') {
      if (elementID !== 'login') {
        paragraph.innerHTML = newText;
      }
      var timer = setInterval(function() {
        if (opacity <= 0.1) {
          clearInterval(timer);
          if (newText === 'Logged in.') {
            loginUtils.fadeOut('login', 'Logging in.');
          }
          else {
            paragraph.innerHTML = '&nbsp;';
          }
        }
        paragraph.style.opacity = opacity.toString();
        paragraph.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
        opacity -= opacity * 0.1;
      }, 80);
    }
  },

  executeQuery: function(serviceUrl) {
    $.ajax({
      url: serviceUrl,
      success: function(response) {
        loginUtils.fadeOut('exceptionText', response.toString());
        window.onbeforeunload = function () { // Or maybe just add save button in the game
          return 'All unsaved progress will be lost. Do you really want to quit?';
        };
      },
      error: function(response) {
        alert(response.responseText);
      }
    });
  },

  executeQuerySync: function(serviceUrl) {
    return $.ajax({
      url: serviceUrl,
      async: false
    }).responseText;
  },

  isValidEmail: function(email) {
    var emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegularExpression.test(email);
  },

  loginOrRegister: function() {
    var email = document.getElementById('email')['value'];
    var password = document.getElementById('password')['value'];
    var requestParams = 'email=' + email + '&password=' + password;

    if (email && password) {
      if (!loginUtils.isValidEmail(email)) {
        loginUtils.fadeOut('exceptionText', 'Invalid email.');
        return;
      }
      loginUtils.executeQuery('/services/login?' + requestParams);
    }
    else {
      loginUtils.fadeOut('exceptionText', 'Please fill the fields.');
    }
  },

  getSessionInfo: function() {
    var sessionInfo = loginUtils.executeQuerySync('/session/info');
    return sessionInfo;
  },

  saveGame: function(saveData) {
    var result = loginUtils.executeQuerySync('/services/game/save?saveData=' + JSON.stringify(saveData));
    alert(result);
  },

  loadGame: function() {
    var result = loginUtils.executeQuerySync('/services/game/load');
    return result;
  }
};
