"use strict";

class AndroidLicense {

  constructor(form, checkoutData) {
    this._form = form;
    this._checkoutData = checkoutData;
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

  loadPrice() {
    this._paddle.then(paddle => {
      let request = {
        items: [{ priceId: PADDLE_ANDROID_PRICE_ID, quantity: 1}]
      };
      paddle.PricePreview(request).then(result => {
        this._checkoutData.price = {
          currencyCode: result.data.currencyCode,
          amount: result.data.details.lineItems[0].totals.total,
          formattedAmount: result.data.details.lineItems[0].formattedTotals.total
        };
      }).catch(() => {
        this._checkoutData.errorMessage = 'Retrieving price failed. Please try again later.';
      });
      if (PADDLE_ANDROID_SALE_PRICE_ID) {
        let saleRequest = {
          items: [{ priceId: PADDLE_ANDROID_SALE_PRICE_ID, quantity: 1 }]
        };
        paddle.PricePreview(saleRequest).then(saleResult => {
          this._checkoutData.discountedPrice = {
            priceId: PADDLE_ANDROID_SALE_PRICE_ID,
            amount: saleResult.data.details.lineItems[0].totals.total,
            formattedAmount: saleResult.data.details.lineItems[0].formattedTotals.total
          };
        }).catch(() => {
          // sale price not available, proceed with regular price
        });
      }
    });
  }

  checkout(locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._checkoutData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this._checkoutData.email !== this._checkoutData.emailConfirm) {
      this._checkoutData.errorMessage = 'Email addresses do not match.';
      return;
    }

    this._checkoutData.inProgress = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.success = false;
    let checkoutPriceId = this._checkoutData.discountedPrice ? this._checkoutData.discountedPrice.priceId : PADDLE_ANDROID_PRICE_ID;
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        settings: { locale: locale },
        items: [{ priceId: checkoutPriceId, quantity: 1 }],
        customer: { email: this._checkoutData.email }
      });
    });
  }

  onCheckoutSucceeded() {
    this._checkoutData.success = true;
    this._checkoutData.errorMessage = '';
    this._checkoutData.inProgress = false;
  }

}
