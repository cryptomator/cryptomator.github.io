"use strict";

const BILLING_PORTAL_SESSION_URL = STORE_API_URL + '/hub/billing-portal-session';
const CUSTOM_BILLING_URL = STORE_API_URL + '/hub/custom-billing';
const GENERATE_PAY_LINK_URL = STORE_API_URL + '/hub/generate-pay-link';
const MANAGE_SUBSCRIPTION_URL = STORE_API_URL + '/hub/manage-subscription';
const UPDATE_PAYMENT_METHOD_URL = STORE_API_URL + '/hub/update-payment-method';

class HubSubscription {

  constructor(form, subscriptionData, searchParams) {
    this._form = form;
    this._subscriptionData = subscriptionData;
    this._subscriptionData.hubId = searchParams.get('hub_id');
    let encodedReturnUrl = searchParams.get('return_url');
    if (encodedReturnUrl) {
      this._subscriptionData.returnUrl = decodeURIComponent(encodedReturnUrl);  
    }
    this._subscriptionData.session = searchParams.get('session');
    if (this._subscriptionData.hubId && this._subscriptionData.hubId.length > 0 && this._subscriptionData.returnUrl && this._subscriptionData.returnUrl.length > 0) {
      this._subscriptionData.state = 'LOADING';
      this.loadSubscription();
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

  loadSubscription() {
    this.loadCustomBilling(() => {
      this.loadPrice(() => {
        this._subscriptionData.inProgress = true;
        this._subscriptionData.errorMessage = '';
        $.ajax({
          url: MANAGE_SUBSCRIPTION_URL,
          type: 'GET',
          data: {
            hub_id: this._subscriptionData.hubId,
            session: this._subscriptionData.session
          }
        }).done(data => {
          this.onLoadSubscriptionSucceeded(data);
        }).fail(xhr => {
          this.onLoadSubscriptionFailed(xhr.status, xhr.responseJSON?.message || 'Loading subscription failed.');
        });
      });
    });
  }

  onLoadSubscriptionSucceeded(data) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    if (data.subscription.quantity) {
      this._subscriptionData.quantity = data.subscription.quantity;
    }
    this._subscriptionData.state = 'EXISTING_CUSTOMER';
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onLoadSubscriptionFailed(status, error) {
    if (status == 404) {
      this._subscriptionData.state = 'NEW_CUSTOMER';
      this._subscriptionData.errorMessage = '';
    } else if (status == 400) {
      // Assuming that the error is due to the session being missing.
      this._subscriptionData.state = 'CREATE_SESSION';
      this._subscriptionData.errorMessage = '';
    } else {
      this._subscriptionData.state = 'CREATE_SESSION';
      this._subscriptionData.errorMessage = error;
    }
    this._subscriptionData.inProgress = false;
  }

  createSession() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._subscriptionData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: BILLING_PORTAL_SESSION_URL,
      type: 'POST',
      data: {
        captcha: this._subscriptionData.captcha,
        hub_id: this._subscriptionData.hubId,
        return_url: this._subscriptionData.returnUrl
      }
    }).done(_ => {
      this.onCreateSessionSucceeded();
    }).fail(xhr => {
      this.onCreateSessionFailed(xhr.responseJSON?.message || 'Creating billing portal session failed.');
    });
  }

  onCreateSessionSucceeded() {
    this._subscriptionData.state = 'CREATE_SESSION_SUCCESS';
    this._subscriptionData.inProgress = false;
    this._subscriptionData.errorMessage = '';
  }

  onCreateSessionFailed(error) {
    this._subscriptionData.inProgress = false;
    this._subscriptionData.errorMessage = error;
  }

  loadCustomBilling(continueHandler) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: CUSTOM_BILLING_URL,
      type: 'GET',
      data: {
        hub_id: this._subscriptionData.hubId
      }
    }).done(data => {
      this.onLoadCustomBillingSucceeded(data);
      if (data.custom_billing.manual_invoice) {
        this._subscriptionData.state = 'MANUAL_INVOICE';
      } else {
        continueHandler();
      }
    }).fail(xhr => {
      this.onLoadCustomBillingFailed(xhr.status, xhr.responseJSON?.message || 'Loading custom billing options failed.');
      if (xhr.status == 404 && xhr.responseJSON?.status == 'error') {
        continueHandler();
      }
    });
  }

  onLoadCustomBillingSucceeded(data) {
    this._subscriptionData.customBilling = data.custom_billing;
    this._subscriptionData.quantity = this._subscriptionData.customBilling.quantity || this._subscriptionData.quantity;
    this._subscriptionData.email = this._subscriptionData.customBilling.email || this._subscriptionData.email;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onLoadCustomBillingFailed(status, error) {
    if (status == 404) {
      this._subscriptionData.customBilling = null;
      this._subscriptionData.errorMessage = '';
    } else {
      this._subscriptionData.errorMessage = error;
    }
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
    let product = data.response.products[0];
    let currency = product.currency;
    let netAmount;
    let recurringNetAmount;
    let grossAmount;
    let recurringGrossAmount;
    if (this._subscriptionData.customBilling?.override?.prices) {
      netAmount = this.getAmount(this._subscriptionData.customBilling.override.prices, currency) / 12;
      recurringNetAmount = this.getAmount(this._subscriptionData.customBilling.override.recurring_prices, currency) / 12;
      let taxRate = product.subscription.price.gross / product.subscription.price.net;
      grossAmount = netAmount * taxRate;
      recurringGrossAmount = recurringNetAmount * taxRate;
    } else {
      netAmount = product.subscription.price.net / 12;
      recurringNetAmount = netAmount;
      grossAmount = product.subscription.price.gross / 12;
      recurringGrossAmount = grossAmount;
    }
    this._subscriptionData.monthlyPrice = {
      netAmount: netAmount,
      recurringNetAmount: recurringNetAmount,
      grossAmount: grossAmount,
      recurringGrossAmount: recurringGrossAmount,
      currency: currency
    };
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  getAmount(prices, currency) {
    let regex = new RegExp(`^${currency}:`);
    let price = prices.find(price => regex.test(price));
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
    if (this._subscriptionData.customBilling?.managed) {
      this.customCheckout(PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID, locale);
    } else {
      this.customCheckout(PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID, locale);
    }
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
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'POST',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        subscription_id: subscriptionId
      }
    }).done(data => {
      this.onPostSucceeded(data);
    }).fail(xhr => {
      this.onPostFailed(xhr.responseJSON?.message || 'Adding subscription failed.');
    });
  }

  onPostSucceeded(data) {
    this._subscriptionData.state = 'EXISTING_CUSTOMER';
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    this._subscriptionData.session = data.session;
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set('session', data.session);
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    this.transferTokenToHub();
  }

  onPostFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  updatePaymentMethod(locale) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: UPDATE_PAYMENT_METHOD_URL,
      type: 'GET',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        subscription_id: this._subscriptionData.details.subscription_id
      }
    }).done(data => {
      this._paddle.then(paddle => {
        paddle.Checkout.open({
          override: data.url,
          locale: locale,
          successCallback: _ => this.loadSubscription(),
          closeCallback: () => {
            this._subscriptionData.inProgress = false;
          }
        });
      });
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating payment method failed.');
    });
  }

  pause() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        pause: true
      }
    }).done(data => {
      this.onPutSucceeded(data, false);
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
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
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        pause: false,
        preview: true
      }
    }).done(data => {
      this._subscriptionData.restartModal.nextPayment = data.subscription.next_payment;
      this._subscriptionData.errorMessage = '';
      this._subscriptionData.inProgress = false;
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Calculating price failed.');
    });
  }

  restart() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        pause: false
      }
    }).done(data => {
      this.onPutSucceeded(data, this._subscriptionData.details.state == 'paused');
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  openChangeSeatsModal() {
    this._subscriptionData.quantity = this._subscriptionData.details.quantity;
    this._subscriptionData.changeSeatsModal.immediatePayment = null;
    this._subscriptionData.changeSeatsModal.confirmation = false;
    this._subscriptionData.changeSeatsModal.open = true;
  }

  askForChangeSeatsConfirmation() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._subscriptionData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._subscriptionData.changeSeatsModal.confirmation = true;
    this.previewChangeQuantity();
  }

  previewChangeQuantity() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        quantity: this._subscriptionData.quantity,
        preview: true
      }
    }).done(data => {
      this._subscriptionData.changeSeatsModal.immediatePayment = data.subscription.immediate_payment;
      this._subscriptionData.errorMessage = '';
      this._subscriptionData.inProgress = false;
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Calculating price failed.');
    });
  }

  changeQuantity() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: MANAGE_SUBSCRIPTION_URL,
      type: 'PUT',
      data: {
        hub_id: this._subscriptionData.hubId,
        session: this._subscriptionData.session,
        quantity: this._subscriptionData.quantity
      }
    }).done(data => {
      this._subscriptionData.changeSeatsModal.open = false;
      this.onPutSucceeded(data, true);
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  onPutSucceeded(data, shouldOpenReturnUrl) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    if (shouldOpenReturnUrl) {
      this.transferTokenToHub();
    }
  }

  onPutFailed(status, error) {
    if (status == 401) {
      this._subscriptionData.state = 'CREATE_SESSION';
    }
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  transferTokenToHub() {
    window.open(this._subscriptionData.returnUrl + '?token=' + this._subscriptionData.token, '_self');
  }

}
