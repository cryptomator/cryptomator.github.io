"use strict";

// requires store.js

class PaddleCheckout {

  constructor(checkoutData) {
    this._checkoutData = checkoutData;
    this._checkoutData.transactionId = new URLSearchParams(window.location.search).get('_ptxn');
    this._paddle = $.ajax({
      url: 'https://cdn.paddle.com/paddle/v2/paddle.js',
      cache: true,
      dataType: 'script'
    }).then(() => {
      if (PADDLE_ENABLE_SANDBOX) {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Initialize({
        token: PADDLE_TOKEN,
        eventCallback: data => {
          if (data.name == "checkout.completed") {
            this.onCheckoutSucceeded();
          } else if (data.name == "checkout.closed") {
            this._checkoutData.inProgress = false;
          }
        }      
      });
      return window.Paddle;
    });
  }

  checkout(locale) {
    if (this._checkoutData.transactionId == null) {
      this._checkoutData.errorMessage = 'Transaction ID is missing.';
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        settings: { locale: locale},
        transactionId: this._checkoutData.transactionId
      });
    });
  }

  onCheckoutSucceeded() {
    this._checkoutData.success = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.inProgress = false;
  }

}
