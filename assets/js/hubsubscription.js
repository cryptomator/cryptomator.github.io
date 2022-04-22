"use strict";

// const PADDLE_ENABLE_SANDBOX = false;
// const PADDLE_VENDOR_ID = 39223;
// const HUB_SUBSCRIPTION_PLAN_ID = TODO;
// const SUBSCRIPTION_URL = 'https://store.cryptomator.org/api/hub/subscription';

const PADDLE_ENABLE_SANDBOX = true;
const PADDLE_VENDOR_ID = 1385;
const HUB_SUBSCRIPTION_PLAN_ID = 23141;
const SUBSCRIPTION_URL = 'http://localhost:8787/api/hub/subscription';

class HubSubscription {

  constructor(subscriptionData, searchParams) {
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
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.getSuccess = false;
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
  }

  onGetSucceeded(data) {
    this._subscriptionData.token = data.token;
    this._subscriptionData.details = data.subscription;
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

  checkout(locale) {
    // if (!$(this._form)[0].checkValidity()) {
    //   $(this._form).find(':input').addClass('show-invalid');
    //   return;
    // }

    // this._subscriptionData.inProgress = true;
    // this._subscriptionData.errorMessage = '';
    // this._subscriptionData.success = false;
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        product: HUB_SUBSCRIPTION_PLAN_ID,
        // email: this._subscriptionData.email,
        locale: locale,
        passthrough: '{"hub_id": ' + this._subscriptionData.hubId + '}',
        successCallback: data => this.getPaddleOrderDetails(data.checkout.id),
        closeCallback: () => {
          // this._subscriptionData.inProgress = false;
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
          // this._subscriptionData.errorMessage = 'Retrieving subscription failed. Please check your emails instead.';
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
    // this._subscriptionData.success = true;
    // this._subscriptionData.errorMessage = '';
    // this._subscriptionData.inProgress = false;
    this._subscriptionData.token = data.token;
    window.open(this._subscriptionData.returnUrl + '?token=' + data.token, '_self');
  }

  onPostFailed(error) {
    // this._subscriptionData.success = false;
    // this._subscriptionData.errorMessage = error;
    // this._subscriptionData.inProgress = false;
  }

}
