"use strict";

class DesktopLicense {

  constructor(form, checkoutData) {
    this._form = form;
    this._checkoutData = checkoutData;
    this._paddle = $.ajax({
        url: 'https://cdn.paddle.com/paddle/paddle.js',
        cache: true,
        dataType: 'script'
    }).then(() => {
      window.Paddle.Setup({ vendor: 39223 });
      return window.Paddle;
    });
  }

  checkout() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    $.ajax({
      url: 'https://store.cryptomator.org/paddle/desktop/generate-pay-link.php',
      type: 'POST',
      data: {
        currency: this._checkoutData.currency,
        amount: this._checkoutData.amount
      }
    }).done(data => {
      this.openPaddleCheckout(data.pay_link);
    }).fail(xhr => {
      this.onCheckoutFailed(xhr.responseJSON.error || 'Generating pay link failed.');
    });
  }

  openPaddleCheckout(payLink) {
    this._paddle.Checkout.open({
      override: payLink,
      email: this._checkoutData.email,
      allowQuantity: false,
      successCallback: data => {
        this.onCheckoutSucceeded();
        this.getPaddleOrderDetails(data.checkout.id)
      },
      closeCallback: () => {
        this._checkoutData.inProgress = false;
      }
    })
  }

  getPaddleOrderDetails(checkoutId) {
    this._paddle.Order.details(checkoutId, data => {
      this._checkoutData.licenseKey = data.lockers[0].license_code;
    });
  }

  onCheckoutFailed(error) {
    this._checkoutData.success = false;
    this._checkoutData.errorMessage = error;
    this._checkoutData.inProgress = false;
  }

  onCheckoutSucceeded() {
    this._checkoutData.success = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.inProgress = false;
  }

}
