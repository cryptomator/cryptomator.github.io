"use strict";

const PADDLE_ENABLE_SANDBOX = false;
const PADDLE_VENDOR_ID = 39223;
const ANDROID_PRODUCT_ID = 578277;

// const PADDLE_ENABLE_SANDBOX = true;
// const PADDLE_VENDOR_ID = 1385;
// const ANDROID_PRODUCT_ID = 9642;

class AndroidLicense {

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
    this._paddle.then(paddle => {
      paddle.Product.Prices(ANDROID_PRODUCT_ID, prices => {
        this._checkoutData.price = prices.price.gross;
      });
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
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        product: ANDROID_PRODUCT_ID,
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
        let licenseKey = data.lockers?.[0]?.license_code;
        if (licenseKey) {
          this._checkoutData.licenseKey = licenseKey;
        } else {
          this._checkoutData.errorMessage = 'Retrieving license key failed. Please check your emails instead.';
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
