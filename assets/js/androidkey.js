"use strict";

class AndroidLicense {

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

  loadPrice() {
    this._paddle.then(paddle => {
      paddle.Product.Prices(this._checkoutData.productId, prices => {
        this._checkoutData.price = prices.price.gross;
      });
    });
  }

  checkout(locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        product: this._checkoutData.productId,
        email: this._checkoutData.email,
        allowQuantity: false,
        locale: locale,
        successCallback: data => {
          this.onCheckoutSucceeded();
          this.getPaddleOrderDetails(data.checkout.id)
        },
        closeCallback: () => {
          this._checkoutData.inProgress = false;
        }
      });
    });
  }

  getPaddleOrderDetails(checkoutId) {
    this._paddle.then(paddle => {
      paddle.Order.details(checkoutId, data => {
        this._checkoutData.licenseKey = data.lockers[0].license_code;
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
