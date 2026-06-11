"use strict";

const CARD_CHECKOUT_URL = API_BASE_URL + '/billing/paddle-classic/checkout';
const INVOICE_CHECKOUT_URL = API_BASE_URL + '/billing/espocrm/checkout';
const MANAGE_SUBSCRIPTION_BASE_URL = API_BASE_URL + '/billing/manage/subscription';
const SESSION_REQUEST_URL = API_BASE_URL + '/billing/manage/session/request';
const SESSION_CONFIRM_URL = API_BASE_URL + '/billing/manage/session/confirm';
const CUSTOM_BILLING_URL = LEGACY_STORE_URL + '/hub/custom-billing';
const REFRESH_LICENSE_URL = API_BASE_URL + '/licenses/hub/refresh';

class HubSubscription {

  constructor(form, subscriptionData, searchParams) {
    this._form = form;
    this._subscriptionData = subscriptionData;
    let fragmentParams = new URLSearchParams(location.hash.substring(1));
    this._subscriptionData.oldLicense = fragmentParams.get('oldLicense');
    if (this._subscriptionData.oldLicense) {
      this._subscriptionData.hubId = this.extractHubId(this._subscriptionData.oldLicense);
      if (!this._subscriptionData.hubId) {
        this._subscriptionData.oldLicense = null;
      }
    }
    this._subscriptionData.hubId = this._subscriptionData.hubId ?? fragmentParams.get('hub_id') ?? searchParams.get('hub_id');
    let returnUrl = fragmentParams.get('returnUrl') ?? searchParams.get('return_url');
    if (returnUrl) {
      this._subscriptionData.returnUrl = returnUrl;
    }
    let nonce = fragmentParams.get('nonce');
    if (nonce) {
      this.restoreHubContext();
      history.replaceState(null, '', location.pathname + location.search);
      this._subscriptionData.state = 'LOADING';
      this.confirmSession(nonce);
    } else if (this._subscriptionData.hubId && this._subscriptionData.hubId.length > 0 && this._subscriptionData.returnUrl && this._subscriptionData.returnUrl.length > 0) {
      this._subscriptionData.state = 'LOADING';
      this.loadCheckoutPrerequisites();
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

  extractHubId(license) {
    try {
      let base64 = license.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)).jti;
    } catch (e) {
      console.error('Failed to parse hub token:', e);
      return null;
    }
  }

  authHeaders() {
    return { Authorization: 'Bearer ' + this._subscriptionData.sessionToken };
  }

  restoreHubContext() {
    let hubId = this._subscriptionData.hubId;
    let oldLicense = sessionStorage.getItem(`hubOldLicense:${hubId}`);
    if (oldLicense) {
      this._subscriptionData.oldLicense = oldLicense;
    }
    let returnUrl = sessionStorage.getItem(`hubReturnUrl:${hubId}`);
    if (returnUrl) {
      this._subscriptionData.returnUrl = returnUrl;
    }
  }

  loadCheckoutPrerequisites() {
    this.loadCustomBilling(() => {
      if (this._subscriptionData.customBilling?.manual_invoice) {
        this._subscriptionData.state = 'MANUAL_INVOICE';
        return;
      }
      this.loadPrice(() => {
        this._subscriptionData.state = 'NEW_CUSTOMER';
        this._subscriptionData.errorMessage = '';
        this._subscriptionData.inProgress = false;
      });
    });
  }

  loadManageSubscription() {
    this.loadCustomBilling(() => {
      this._subscriptionData.inProgress = true;
      this._subscriptionData.errorMessage = '';
      $.ajax({
        url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}`,
        type: 'GET',
        headers: this.authHeaders()
      }).done(data => {
        this.onLoadSubscriptionSucceeded(data);
      }).fail(xhr => {
        this.onLoadSubscriptionFailed(xhr.status, xhr.responseJSON?.message || 'Loading subscription failed.');
      });
    });
  }

  onLoadSubscriptionSucceeded(data) {
    this._subscriptionData.details = {
      processor: data.processor,
      status: data.status,
      seats: data.seats,
      current_period_end: data.current_period_end
    };
    this._subscriptionData.quantity = data.seats;
    this._subscriptionData.state = 'EXISTING_CUSTOMER';
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    this._subscriptionData.needsTokenRefresh = !!this._subscriptionData.oldLicense;
  }

  onLoadSubscriptionFailed(status, error) {
    if (status == 401) {
      this._subscriptionData.state = 'CREATE_SESSION';
      this._subscriptionData.errorMessage = '';
    } else if (status == 404 && this._subscriptionData.returnUrl) {
      this.loadCheckoutPrerequisites();
      return;
    } else if (status == 404) {
      this._subscriptionData.state = 'MISSING_PARAMS';
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

    let hubId = this._subscriptionData.hubId;
    if (this._subscriptionData.oldLicense) {
      sessionStorage.setItem(`hubOldLicense:${hubId}`, this._subscriptionData.oldLicense);
    }
    if (this._subscriptionData.returnUrl) {
      sessionStorage.setItem(`hubReturnUrl:${hubId}`, this._subscriptionData.returnUrl);
    }
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SESSION_REQUEST_URL,
      type: 'POST',
      data: {
        captcha: this._subscriptionData.captcha,
        hub_id: this._subscriptionData.hubId
      }
    }).done(_ => {
      this.onCreateSessionSucceeded();
    }).fail(xhr => {
      this.onCreateSessionFailed(xhr.responseJSON?.message || 'Requesting access failed.');
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

  confirmSession(nonce) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: SESSION_CONFIRM_URL,
      type: 'POST',
      data: {
        nonce: nonce
      }
    }).done(data => {
      this._subscriptionData.sessionToken = data.token;
      this.loadManageSubscription();
    }).fail(xhr => {
      this.onConfirmSessionFailed(xhr.responseJSON?.message || 'Confirming access failed.');
    });
  }

  onConfirmSessionFailed(error) {
    this._subscriptionData.state = 'CREATE_SESSION';
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
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
      continueHandler();
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
    let isManaged = this._subscriptionData.customBilling?.managed;
    let yearlyPlanId = isManaged ? PADDLE_HUB_MANAGED_YEARLY_PLAN_ID : PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID;
    let monthlyPlanId = isManaged ? PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID : PADDLE_HUB_SELF_HOSTED_MONTHLY_PLAN_ID;
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: yearlyPlanId + ',' + monthlyPlanId
      },
    }).done(data => {
      this.onLoadPriceSucceeded(data, yearlyPlanId, monthlyPlanId);
      continueHandler();
    }).fail(xhr => {
      this.onLoadPriceFailed(xhr.responseJSON?.message || 'Loading price failed.');
    });
  }

  onLoadPriceSucceeded(data, yearlyPlanId, monthlyPlanId) {
    let products = data.response.products;
    let yearlyProduct = products.find(p => p.product_id == yearlyPlanId);
    let monthlyProduct = products.find(p => p.product_id == monthlyPlanId);
    let yearlyPrice = yearlyProduct.subscription.price;
    let monthlyPrice = monthlyProduct.subscription.price;
    let currency = yearlyProduct.currency;
    this._subscriptionData.yearlyPlanPrice = this.calculateYearlyPlanPrice(yearlyPrice, currency);
    this._subscriptionData.monthlyPlanPrice = {
      netAmount: monthlyPrice.net,
      recurringNetAmount: monthlyPrice.net,
      grossAmount: monthlyPrice.gross,
      recurringGrossAmount: monthlyPrice.gross,
      currency: currency
    };
    this._subscriptionData.savingsPercent = Math.round((1 - yearlyPrice.net / (monthlyPrice.net * 12)) * 100);
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  calculateYearlyPlanPrice(yearlyPrice, currency) {
    let taxRate = yearlyPrice.gross / yearlyPrice.net;
    let customBillingOverride = this._subscriptionData.customBilling?.override;
    let customPriceAmount = customBillingOverride?.prices
      ? this.getAmount(customBillingOverride.prices, currency)
      : null;
    let netAmount = (customPriceAmount ?? yearlyPrice.net) / 12;
    let customRecurringAmount = customBillingOverride?.recurring_prices
      ? this.getAmount(customBillingOverride.recurring_prices, currency)
      : null;
    let recurringNetAmount = customRecurringAmount ? customRecurringAmount / 12 : netAmount;
    return {
      netAmount: netAmount,
      recurringNetAmount: recurringNetAmount,
      grossAmount: netAmount * taxRate,
      recurringGrossAmount: recurringNetAmount * taxRate,
      currency: currency
    };
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

  selectedPlanId() {
    let isManaged = this._subscriptionData.customBilling?.managed;
    let isMonthly = this._subscriptionData.billingInterval === 'monthly';
    if (isManaged) {
      return isMonthly ? PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID : PADDLE_HUB_MANAGED_YEARLY_PLAN_ID;
    } else {
      return isMonthly ? PADDLE_HUB_SELF_HOSTED_MONTHLY_PLAN_ID : PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID;
    }
  }

  checkout(locale) {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._subscriptionData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this.customCheckout(this.selectedPlanId(), locale);
  }

  customCheckout(productId, locale) {
    $.ajax({
      url: CARD_CHECKOUT_URL,
      type: 'POST',
      data: {
        captcha: this._subscriptionData.cardCaptcha,
        hub_id: this._subscriptionData.hubId,
        product_id: productId,
        quantity: this._subscriptionData.quantity
      }
    }).done(data => {
      this.openPaddleCheckout(data.pay_link, locale);
    }).fail(xhr => {
      this.onPostFailed(xhr.responseJSON?.message || 'Checkout failed.');
    });
  }

  openPaddleCheckout(payLink, locale) {
    this._paddle.then(paddle => {
      paddle.Checkout.open({
        override: payLink,
        email: this._subscriptionData.email,
        locale: locale,
        passthrough: JSON.stringify({ hub_id: this._subscriptionData.hubId }),
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
          this.onCheckoutSucceeded();
        } else {
          this._subscriptionData.errorMessage = 'Retrieving subscription failed. Please check your emails instead.';
        }
      });
    });
  }

  invoiceCheckout() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._subscriptionData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    let invoice = this._subscriptionData.invoice;
    $.ajax({
      url: INVOICE_CHECKOUT_URL,
      type: 'POST',
      data: {
        captcha: this._subscriptionData.invoiceCaptcha,
        hub_id: this._subscriptionData.hubId,
        product_id: this.selectedPlanId(),
        quantity: this._subscriptionData.quantity,
        account_name: invoice.account_name,
        vat_id: invoice.vat_id,
        address_street: invoice.address_street,
        address_postal_code: invoice.address_postal_code,
        address_city: invoice.address_city,
        address_country: invoice.address_country,
        contact_first_name: invoice.contact_first_name,
        contact_last_name: invoice.contact_last_name,
        contact_email: invoice.contact_email
      }
    }).done(_ => {
      this.onCheckoutSucceeded();
    }).fail(xhr => {
      this.onPostFailed(xhr.responseJSON?.message || 'Creating subscription failed.');
    });
  }

  onCheckoutSucceeded() {
    this._subscriptionData.state = 'CHECKOUT_SUCCESS';
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    if (this._subscriptionData.oldLicense) {
      this._subscriptionData.needsTokenRefresh = true;
      this._subscriptionData.shouldTransferToHub = !!this._subscriptionData.returnUrl;
    }
  }

  onPostFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  updatePaymentMethod(locale) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}/payment-method`,
      type: 'GET',
      headers: this.authHeaders()
    }).done(data => {
      this._paddle.then(paddle => {
        paddle.Checkout.open({
          override: data.url,
          locale: locale,
          successCallback: _ => this.loadManageSubscription(),
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
      url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}/pause`,
      type: 'POST',
      headers: this.authHeaders()
    }).done(_ => {
      this.loadManageSubscription();
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  askForRestartConfirmation() {
    this._subscriptionData.restartModal.open = true;
  }

  restart() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}/resume`,
      type: 'POST',
      headers: this.authHeaders()
    }).done(_ => {
      this._subscriptionData.restartModal.open = false;
      this._subscriptionData.shouldTransferToHub = !!this._subscriptionData.returnUrl;
      this.loadManageSubscription();
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  openChangeSeatsModal() {
    this._subscriptionData.quantity = this._subscriptionData.details.seats;
    this._subscriptionData.changeSeatsModal.nextPayment = null;
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
    if (this._subscriptionData.details.processor == 'PADDLE_CLASSIC') {
      this.previewChangeQuantity();
    }
  }

  previewChangeQuantity() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}/seats/preview`,
      type: 'POST',
      headers: this.authHeaders(),
      data: {
        quantity: this._subscriptionData.quantity
      }
    }).done(data => {
      this._subscriptionData.changeSeatsModal.nextPayment = data.next_payment;
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
      url: `${MANAGE_SUBSCRIPTION_BASE_URL}/${this._subscriptionData.hubId}/seats`,
      type: 'POST',
      headers: this.authHeaders(),
      data: {
        quantity: this._subscriptionData.quantity
      }
    }).done(_ => {
      this._subscriptionData.changeSeatsModal.open = false;
      this._subscriptionData.shouldTransferToHub = !!this._subscriptionData.returnUrl;
      this.loadManageSubscription();
    }).fail(xhr => {
      this.onPutFailed(xhr.status, xhr.responseJSON?.message || 'Updating subscription failed.');
    });
  }

  onPutFailed(status, error) {
    if (status == 401) {
      this._subscriptionData.state = 'CREATE_SESSION';
    }
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  refreshToken() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: REFRESH_LICENSE_URL,
      type: 'POST',
      data: {
        token: this._subscriptionData.oldLicense,
        captcha: this._subscriptionData.captcha
      }
    }).done(token => {
      this._subscriptionData.token = token;
      this._subscriptionData.needsTokenRefresh = false;
      this._subscriptionData.errorMessage = '';
      this._subscriptionData.inProgress = false;
      if (this._subscriptionData.shouldTransferToHub) {
        this.transferTokenToHub();
      }
    }).fail(xhr => {
      this._subscriptionData.errorMessage = xhr.responseJSON?.message || 'Refreshing license failed.';
      this._subscriptionData.needsTokenRefresh = false;
      this._subscriptionData.inProgress = false;
    });
  }

  transferTokenToHub() {
    window.open(this._subscriptionData.returnUrl + '?token=' + this._subscriptionData.token, '_self');
  }

}
