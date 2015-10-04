/* global document alert $ */

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

  executeQuery: function(parameters) {
    $.ajax({
      url: '/services/login?' + parameters,
      success: function(response) {
        loginUtils.fadeOut('exceptionText', response.toString());
      },
      error: function(response) {
        alert(response.responseText);
      }
    });
  },

  isValidEmail: function(email) {
    var emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegularExpression.test(email);
  },

  loginOrRegister: function() {
    var email = document.getElementById('email')['value'];
    var password = document.getElementById('password')['value'];
    var request = 'email=' + email + '&password=' + password;

    if (email && password) {
      if (!loginUtils.isValidEmail(email)) {
        loginUtils.fadeOut('exceptionText', 'Invalid email.');
        return;
      }
      loginUtils.executeQuery(request);
    }
    else {
      loginUtils.fadeOut('exceptionText', 'Please fill the fields.');
    }
  }
};