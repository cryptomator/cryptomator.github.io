"use strict";

// requires desktopkey.js or androidkey.js

class KeyRecovery {

  constructor(form, data) {
    this._form = form;
    this._data = data;
    this._paddle = $.ajax({
        url: 'https://cdn.paddle.com/paddle/paddle.js',
        cache: true,
        dataType: 'script'
    }).then(() => {
      if (PADDLE_ENABLE_SANDBOX) {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Setup({ vendor: PADDLE_VENDOR_ID });
      return window.Paddle;
    });
  }

  getUserHistory() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._data.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._data.inProgress = true;
    this._data.errorMessage = '';
    this._data.success = false;
    this._paddle.then(paddle => {
      paddle.User.History(this._data.email, null, response => {
        if (response.success) {
          this.onGetUserHistorySucceeded(response.message);
        } else {
          this.onGetUserHistoryFailed(response.error.message);
        }
      });
    });
  }

  onGetUserHistoryFailed(error) {
    this._data.success = false;
    this._data.errorMessage = error;
    this._data.inProgress = false;
  }

  onGetUserHistorySucceeded() {
    this._data.success = true;
    this._data.errorMessage = '';
    this._data.inProgress = false;
  }

}
