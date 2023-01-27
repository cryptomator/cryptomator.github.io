"use strict";

// requires store.js
const CUSTOM_BILLING_URL = STORE_API_URL + '/hub/custom-billing';
const GENERATE_PAY_LINK_URL = STORE_API_URL + '/hub/generate-pay-link';
const SUBSCRIPTION_URL = STORE_API_URL + '/hub/subscription';

class HubSubscription {

  constructor(form, subscriptionData, searchParams) {
    this._form = form;
    this._subscriptionData = subscriptionData;
    this._subscriptionData.hubId = searchParams.get('hub_id');
    if (this._subscriptionData.hubId && this._subscriptionData.hubId.length > 0) {
      this.get();
    }
    let encodedReturnUrl = searchParams.get('return_url');
    if (encodedReturnUrl) {
      this._subscriptionData.returnUrl = decodeURIComponent(encodedReturnUrl);  
    }
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

  get() {
    this._subscriptionData.getSuccess = false;
    this.determineCustomBilling(() => {
      this.loadPrice(() => {
        this._subscriptionData.inProgress = true;
        this._subscriptionData.errorMessage = '';
        $.ajax({
          url: SUBSCRIPTION_URL,
          type: 'GET',
          data: {
            hub_id: this._subscriptionData.hubId
          }
        }).done(data => {
          this.onGetSucceeded(data);
        }).fail(xhr => {
          if (xhr.status == 404 && xhr.responseJSON?.status == 'error') {
            this.onGetNotFound();
          } else {
            this.onGetFailed(xhr.responseJSON?.message || 'Fetching subscription failed.');
          }
        });
      });
    });
  }

  onGetSucceeded(data) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    if (data.subscription.quantity) {
      this._subscriptionData.quantity = data.subscription.quantity;
    }
    this._subscriptionData.getSuccess = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onGetNotFound() {
    this._subscriptionData.getSuccess = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onGetFailed(error) {
    this._subscriptionData.getSuccess = false;
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  determineCustomBilling(continueHandler) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: CUSTOM_BILLING_URL,
      type: 'GET',
      data: {
        hub_id: this._subscriptionData.hubId
      }
    }).done(data => {
      this.onDetermineCustomBillingSucceeded(data);
      continueHandler();
    }).fail(xhr => {
      if (xhr.status == 404 && xhr.responseJSON?.status == 'error') {
        this.onDetermineCustomBillingManagedNotFound();
        continueHandler();
      } else {
        this.onDetermineCustomBillingManagedFailed(xhr.responseJSON?.message || 'Fetching custom billing options failed.');
      }
    });
  }

  onDetermineCustomBillingSucceeded(data) {
    this._subscriptionData.customBilling = data.custom_billing;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onDetermineCustomBillingManagedNotFound() {
    this._subscriptionData.customBilling = null;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onDetermineCustomBillingManagedFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  loadPrice(continueHandler) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    let product_id;
    if (this._subscriptionData.customBilling?.managed) {
      product_id = PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID;
    } else {
      product_id = PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID;
    }
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: product_id
      },
    }).done(data => {
      this.onLoadPriceSucceeded(data);
      continueHandler();
    }).fail(xhr => {
      this.onLoadPriceFailed(xhr.responseJSON?.message || 'Loading price failed.');
    });
  }

  onLoadPriceSucceeded(data) {
    let currency = data.response.products[0].currency;
    let amount;
    if (this._subscriptionData.customBilling?.override?.prices) {
      amount = this.getAmount(this._subscriptionData.customBilling.override.prices, currency) / 12;
    } else {
      amount = data.response.products[0].subscription.price.gross / 12;
    }
    this._subscriptionData.monthlyPrice = {
      amount: amount,
      currency: currency
    };
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  getAmount(prices, currency) {
    const regex = new RegExp(`^${currency}:`);
    const price = prices.find(price => regex.test(price));
    return price ? parseFloat(price.split(':')[1]) : null;
  }

  onLoadPriceFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  checkout(locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._subscriptionData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.postSuccess = false;
    if (this._subscriptionData.customBilling?.managed && this._subscriptionData.customBilling?.override) {
      // managed && override
      this.customCheckout(PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID, locale);
    } else if (this._subscriptionData.customBilling?.managed) {
      // managed && !override
      this.standardCheckout(PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID, locale);
    } else if (this._subscriptionData.customBilling?.override) {
      // !managed && override
      this.customCheckout(PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID, locale);
    } else {
      // !managed && !override
      this.standardCheckout(PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID, locale);
    }
  }

  standardCheckout(productId, locale) {
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        product: productId,
        email: this._subscriptionData.email,
        quantity: this._subscriptionData.quantity,
        locale: locale,
        passthrough: '{"hub_id": ' + this._subscriptionData.hubId + '}',
        successCallback: data => this.getPaddleOrderDetails(data.checkout.id),
        closeCallback: () => {
          this._subscriptionData.inProgress = false;
        }
      });
    });
  }

  customCheckout(productId, locale) {
    $.ajax({
      url: GENERATE_PAY_LINK_URL,
      type: 'POST',
      data: {
        hub_id: this._subscriptionData.hubId,
        product_id: productId,
        quantity: this._subscriptionData.quantity
      }
    }).done(data => {
      this.openPaddleCheckout(data.pay_link, locale);
    }).fail(xhr => {
      this.onPostFailed(xhr.responseJSON?.message || 'Generating pay link failed.');
    });
  }

  openPaddleCheckout(payLink, locale) {
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        override: payLink,
        email: this._subscriptionData.email,
        locale: locale,
        passthrough: '{"hub_id": ' + this._subscriptionData.hubId + '}',
        successCallback: data => this.getPaddleOrderDetails(data.checkout.id),
        closeCallback: () => {
          this._subscriptionData.inProgress = false;
        }
      });
    });
  }

  getPaddleOrderDetails(checkoutId) {
    this._paddle.then(paddle => {
      paddle.Order.details(checkoutId, data => {
        let subscriptionId = data.order.subscription_id;
        if (subscriptionId) {
          this.post(subscriptionId);
        } else {
          this._subscriptionData.errorMessage = 'Retrieving subscription failed. Please check your emails instead.';
        }
      });
    });
  }

  post(subscriptionId) {
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'POST',
      data: {
        hub_id: this._subscriptionData.hubId,
        subscription_id: subscriptionId
      }
    }).done(data => {
      this.onPostSucceeded(data);
    }).fail(xhr => {
      this.onPostFailed(xhr.responseJSON?.message || 'Adding subscription failed.');
    });
  }

  onPostSucceeded(data) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    this._subscriptionData.postSuccess = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    if (this._subscriptionData.returnUrl) {
      window.open(this._subscriptionData.returnUrl + '?token=' + data.token, '_self');
    }
  }

  onPostFailed(error) {
    this._subscriptionData.postSuccess = false;
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  updatePaymentMethod(locale) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        override: this._subscriptionData.details.update_url,
        locale: locale,
        successCallback: _ => this.get(),
        closeCallback: () => {
          this._subscriptionData.inProgress = false;
        }
      });
    });
  }

  pause() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        pause: true
      }
    }).done(data => {
      this.onPutSucceeded(data, false);
    }).fail(xhr => {
      this.onPutFailed(xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  askForRestartConfirmation() {
    this._subscriptionData.restartModal.nextPayment = null;
    this._subscriptionData.restartModal.open = true;
    this.previewRestart();
  }

  previewRestart() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        pause: false,
        preview: true
      }
    }).done(data => {
      this._subscriptionData.restartModal.nextPayment = data.subscription.next_payment;
      this._subscriptionData.errorMessage = '';
      this._subscriptionData.inProgress = false;
    }).fail(xhr => {
      this.onPutFailed(xhr.responseJSON?.message || 'Calculating price failed.');
    });
  }

  restart() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        pause: false
      }
    }).done(data => {
      this.onPutSucceeded(data, true);
    }).fail(xhr => {
      this.onPutFailed(xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  openChangeSeatsModal() {
    this._subscriptionData.quantity = this._subscriptionData.details.quantity;
    this._subscriptionData.changeSeatsModal.immediatePayment = null;
    this._subscriptionData.changeSeatsModal.confirmation = false;
    this._subscriptionData.changeSeatsModal.open = true;
  }

  askForChangeSeatsConfirmation() {
    this._subscriptionData.changeSeatsModal.confirmation = true;
    this.previewChangeQuantity();
  }

  previewChangeQuantity() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        quantity: this._subscriptionData.quantity,
        preview: true
      }
    }).done(data => {
      this._subscriptionData.changeSeatsModal.immediatePayment = data.subscription.immediate_payment;
      this._subscriptionData.errorMessage = '';
      this._subscriptionData.inProgress = false;
    }).fail(xhr => {
      this.onPutFailed(xhr.responseJSON?.message || 'Calculating price failed.');
    });
  }

  changeQuantity() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        quantity: this._subscriptionData.quantity
      }
    }).done(data => {
      this._subscriptionData.changeSeatsModal.open = false;
      this.onPutSucceeded(data, true);
    }).fail(xhr => {
      this.onPutFailed(xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  onPutSucceeded(data, shouldOpenReturnUrl) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    if (shouldOpenReturnUrl && this._subscriptionData.returnUrl) {
      window.open(this._subscriptionData.returnUrl + '?token=' + data.token, '_self');
    }
  }

  onPutFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

}
