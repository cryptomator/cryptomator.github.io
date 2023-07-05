"use strict";

// requires store.js

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

  loadPrice() {
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: PADDLE_DESKTOP_PRODUCT_IDS.join(',')
      },
    }).done(data => {
      this._checkoutData.prices = data.response.products.map(product => {
        return {
          productId: product.product_id,
          amount: product.price.gross,
          currency: product.currency
        }
      });
    });
  }

  checkout(productId, locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._checkoutData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        product: productId,
        email: this._checkoutData.email,
        quantity: this._checkoutData.quantity,
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

  onCheckoutSucceeded() {
    this._checkoutData.success = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.inProgress = false;
  }

}
