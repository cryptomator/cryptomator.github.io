"use strict";

// requires store.js
const GENERATE_PAY_LINK_URL = STORE_API_URL + '/desktop/generate-pay-link';

class DesktopLicense {

  constructor(form, checkoutData) {
    this._form = form;
    this._checkoutData = checkoutData;
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

  checkout(locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._checkoutData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    $.ajax({
      url: GENERATE_PAY_LINK_URL,
      type: 'POST',
      data: {
        amount: this._checkoutData.amount,
        quantity: this._checkoutData.quantity
      }
    }).done(data => {
      this.openPaddleCheckout(data.pay_link, locale);
    }).fail(xhr => {
      this.onCheckoutFailed(xhr.responseJSON?.message || 'Generating pay link failed.');
    });
  }

  openPaddleCheckout(payLink, locale) {
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        override: payLink,
        email: this._checkoutData.email,
        locale: locale,
        successCallback: data => {
          this.onCheckoutSucceeded();
          this.getPaddleOrderDetails(data.checkout.id)
        },
        closeCallback: () => {
          this._checkoutData.inProgress = false;
        }
      });
    })
  }

  getPaddleOrderDetails(checkoutId) {
    this._paddle.then(paddle => {
      paddle.Order.details(checkoutId, data => {
        let licenseKey = data.lockers?.[0]?.license_code;
        if (licenseKey) {
          this._checkoutData.licenseKey = licenseKey;
        } else {
          this._checkoutData.errorMessage = 'Retrieving supporter certificate failed. Please check your emails instead.';
        }
      });
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
