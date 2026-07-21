"use strict";

const BILLING_SESSION_URL = API_BASE_URL + '/billing/session';
const BILLING_CUSTOMER_URL = API_BASE_URL + '/billing/customers/by-hub-id';
const CARD_CHECKOUT_URL = API_BASE_URL + '/billing/paddle-classic/checkout';
const INVOICE_CHECKOUT_URL = API_BASE_URL + '/billing/espocrm/checkout';
const INVOICE_PRICE_URL = API_BASE_URL + '/billing/espocrm/checkout/price';
const MANAGE_SUBSCRIPTION_BASE_URL = API_BASE_URL + '/billing/manage/subscription';
const CUSTOM_BILLING_URL = LEGACY_STORE_URL + '/hub/custom-billing';
const GET_LICENSE_URL = API_BASE_URL + '/licenses/hub';

class HubSubscription {

  constructor(form, subscriptionData, searchParams) {
    this._form = form;
    this._subscriptionData = subscriptionData;
    this._subscriptionData.oldLicense = searchParams.get('oldLicense');
    if (this._subscriptionData.oldLicense) {
      this._subscriptionData.hubId = this.extractHubId(this._subscriptionData.oldLicense);
      if (!this._subscriptionData.hubId) {
        this._subscriptionData.oldLicense = null;
      }
    }
    this._subscriptionData.hubId = this._subscriptionData.hubId ?? searchParams.get('hub_id');
    let returnUrl = searchParams.get('return_url');
    if (returnUrl) {
      this._subscriptionData.returnUrl = returnUrl;
    }
    // Capture the Hub's `token_transfer` value (how the license should be delivered) so it can be stored in
    // the billing session.
    this._subscriptionData.tokenTransfer = searchParams.get('token_transfer') ?? 'queryParam';
    this._subscriptionData.session = searchParams.get('session');
    this._invoicePriceRequestId = 0;
    this._awaitingInvoiceCaptcha = false;
    if (this._subscriptionData.session) {
      // We returned from the confirmation link (/hub/billing?session=<id>): resolve the verified
      // billing session and continue into the manage or checkout flow.
      this._subscriptionData.state = 'LOADING';
      this.loadBillingSession();
    } else if (this._subscriptionData.hubId && this._subscriptionData.hubId.length > 0 && this._subscriptionData.returnUrl && this._subscriptionData.returnUrl.length > 0) {
      // Opened from the Hub without a verified session yet: ask the customer to request a
      // confirmation link before we can manage their subscription or check out.
      this._subscriptionData.state = 'CREATE_SESSION';
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
    return { Authorization: 'Bearer ' + this._subscriptionData.session };
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
    this.refreshToken();
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

  loadBillingSession() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: BILLING_SESSION_URL + '/' + encodeURIComponent(this._subscriptionData.session),
      type: 'GET'
    }).done(data => {
      this.onLoadBillingSessionSucceeded(data);
    }).fail(xhr => {
      this.onLoadBillingSessionFailed(xhr.status, xhr.responseJSON?.message || 'Loading billing session failed.');
    });
  }

  onLoadBillingSessionSucceeded(data) {
    this._subscriptionData.hubId = data.hubId;
    this._subscriptionData.email = data.email;
    this._subscriptionData.returnUrl = data.returnUrl;
    this._subscriptionData.tokenTransfer = data.tokenTransfer;
    if (!this._subscriptionData.invoice.contact_email) {
      this._subscriptionData.invoice.contact_email = data.email;
    }
    this._subscriptionData.errorMessage = '';
    // The session is verified; a session already linked to a billing manages it (the manage endpoints
    // only accept linked sessions), an unlinked one belongs to a new customer heading into checkout.
    if (data.billingId) {
      this.loadManageSubscription();
    } else {
      this.loadCheckoutPrerequisites();
    }
  }

  onLoadBillingSessionFailed(status, error) {
    if (status == 404) {
      this._subscriptionData.state = 'LINK_EXPIRED';
      this._subscriptionData.errorMessage = '';
    } else if (this._subscriptionData.hubId) {
      this._subscriptionData.state = 'CREATE_SESSION';
      this._subscriptionData.errorMessage = error;
    } else {
      this._subscriptionData.state = 'MISSING_PARAMS';
      this._subscriptionData.errorMessage = '';
    }
    this._subscriptionData.inProgress = false;
  }

  lookupCustomer() {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    // First challenge (from /billing/customers/challenge) gates this lookup: it tells us whether
    // the Hub is already linked to a customer before we ask for a confirmation link.
    $.ajax({
      url: BILLING_CUSTOMER_URL + '/' + encodeURIComponent(this._subscriptionData.hubId),
      type: 'GET',
      data: {
        captcha: this._subscriptionData.captcha
      }
    }).done(data => {
      this.onLookupCustomerSucceeded(data);
    }).fail(xhr => {
      this.onLookupCustomerFailed(xhr.status, xhr.responseJSON?.message || 'Looking up your subscription failed.');
    });
  }

  onLookupCustomerSucceeded(data) {
    // The Hub is already linked to a customer: the API returns their redacted email so we can
    // show where the confirmation link will be sent without revealing the full address.
    this._subscriptionData.redactedEmail = data.email;
    this._subscriptionData.needsEmail = false;
    this._subscriptionData.lookupDone = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onLookupCustomerFailed(status, error) {
    // 404 means the Hub is not linked to a customer yet: ask for the purchase email. Any other
    // failure falls back to the same manual entry (the lookup captcha solves only once, so a
    // transient failure cannot re-trigger the lookup, and for a known hub the server ignores the
    // entered address and mails the one on file) — but keeps the error visible.
    this._subscriptionData.inProgress = false;
    this._subscriptionData.needsEmail = true;
    this._subscriptionData.redactedEmail = null;
    this._subscriptionData.lookupDone = true;
    this._subscriptionData.errorMessage = status == 404 ? '' : error;
  }

  createSession() {
    if (!$(this._form)[0].checkValidity()) {
      this.showInvalidFields();
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    let body = {
      hubId: this._subscriptionData.hubId,
      returnUrl: this._subscriptionData.returnUrl,
      tokenTransfer: this._subscriptionData.tokenTransfer,
      verificationLinkTarget: 'billing',
      captcha: this._subscriptionData.captcha
    };
    if (this._subscriptionData.email) {
      body.email = this._subscriptionData.email;
    }
    $.ajax({
      url: BILLING_SESSION_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(body)
    }).done(_ => {
      this.onCreateSessionSucceeded();
    }).fail(xhr => {
      this.onCreateSessionFailed(xhr.responseJSON?.message || 'Requesting confirmation link failed.');
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
      continueHandler();
    }).fail(xhr => {
      this.onLoadCustomBillingFailed(xhr.responseJSON?.message || 'Loading custom billing options failed.');
    });
  }

  onLoadCustomBillingSucceeded(data) {
    // custom_billing is null when the hub has no custom billing
    this._subscriptionData.customBilling = data.custom_billing || null;
    if (this._subscriptionData.customBilling) {
      this._subscriptionData.quantity = this._subscriptionData.customBilling.quantity || this._subscriptionData.quantity;
      this._subscriptionData.email = this._subscriptionData.customBilling.email || this._subscriptionData.email;
    }
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
  }

  onLoadCustomBillingFailed(error) {
    this._subscriptionData.errorMessage = error;
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
      this.showInvalidFields();
      return;
    }

    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this.customCheckout(this.selectedPlanId(), locale);
    // refresh the card captcha for a potential retry; it is the only altcha element rendered
    // while the card method is selected
    this._form.querySelector('altcha-widget')?.reset();
  }

  customCheckout(productId, locale) {
    $.ajax({
      url: CARD_CHECKOUT_URL,
      type: 'POST',
      data: {
        captcha: this._subscriptionData.cardCaptcha,
        hub_id: this._subscriptionData.hubId,
        product_id: productId,
        quantity: this._subscriptionData.quantity,
        session: this._subscriptionData.session
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
        passthrough: JSON.stringify({ hub_id: this._subscriptionData.hubId, session: this._subscriptionData.session }),
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

  invoiceProductId() {
    return this._subscriptionData.customBilling?.managed ? ESPOCRM_HUB_MANAGED_PRODUCT_ID : ESPOCRM_HUB_SELF_HOSTED_PRODUCT_ID;
  }

  loadInvoicePrice() {
    if (!this.invoiceProductId()) {
      return;
    }
    // Keep the previous price visible (dimmed) while reloading, so the summary doesn't jump on seat changes.
    this._subscriptionData.invoicePriceLoading = true;
    this._subscriptionData.invoicePriceError = false;
    // Stale-response guard: only the latest request may populate the summary after rapid seat changes.
    let requestId = ++this._invoicePriceRequestId;
    $.ajax({
      url: INVOICE_PRICE_URL,
      type: 'GET',
      data: {
        hub_id: this._subscriptionData.hubId,
        product_id: this.invoiceProductId(),
        quantity: this._subscriptionData.quantity,
        session: this._subscriptionData.session
      }
    }).done(data => {
      if (requestId === this._invoicePriceRequestId) {
        this._subscriptionData.invoicePrice = data;
        this._subscriptionData.invoicePriceLoading = false;
      }
    }).fail(_ => {
      if (requestId === this._invoicePriceRequestId) {
        this._subscriptionData.invoicePrice = null;
        this._subscriptionData.invoicePriceError = true;
        this._subscriptionData.invoicePriceLoading = false;
      }
    });
  }

  invoiceQuantityMin() {
    return this._subscriptionData.customBilling?.quantity_min || 1;
  }

  invoiceQuantityMax() {
    return this._subscriptionData.customBilling?.quantity_max || 10000;
  }

  setInvoiceQuantity(quantity) {
    this._subscriptionData.quantity = Math.min(this.invoiceQuantityMax(), Math.max(this.invoiceQuantityMin(), quantity || this.invoiceQuantityMin()));
    this.loadInvoicePrice();
  }

  changeInvoiceQuantity(delta) {
    this.setInvoiceQuantity(parseInt(this._subscriptionData.quantity, 10) + delta);
  }

  openInvoiceCheckoutModal() {
    if (!this.invoiceFieldsValid()) {
      this.showInvalidFields();
      return;
    }
    this._subscriptionData.errorMessage = '';
    this._awaitingInvoiceCaptcha = false;
    this._subscriptionData.invoiceCheckoutModal.open = true;
    this.loadInvoicePrice();
  }

  showInvalidFields() {
    $(this._form).find(':input').addClass('show-invalid');
    this._subscriptionData.errorMessage = 'Please fill in all required fields.';
  }

  // Excludes the altcha widget's internal checkbox, whose checked state is mid-flight while the
  // buy button re-solves a challenge.
  invoiceFieldsValid() {
    return $(this._form).find(':input').toArray().filter(el => !el.closest('altcha-widget')).every(el => el.checkValidity());
  }

  startInvoiceCheckout() {
    if (!this.invoiceFieldsValid()) {
      this.showInvalidFields();
      return;
    }
    // Challenges expire server-side within a minute, so solve one fresh at buy time; the widget's
    // verified event then triggers onInvoiceCaptchaVerified() with the new payload. The modal's
    // widget is the only altcha element rendered while the invoice method is selected.
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this._awaitingInvoiceCaptcha = true;
    let captchaWidget = this._form.querySelector('altcha-widget');
    captchaWidget?.reset();
    captchaWidget?.verify();
  }

  // One-shot: altcha's reset() does not abort an in-flight solve, so a stale solve and the fresh
  // one can both fire a verified event — only the first may trigger the checkout, and only while
  // the modal is still open (a solve settling after cancel must not buy anything).
  onInvoiceCaptchaVerified() {
    if (!this._subscriptionData.invoiceCheckoutModal.open) {
      this._awaitingInvoiceCaptcha = false;
      return;
    }
    if (!this._awaitingInvoiceCaptcha) {
      return;
    }
    this._awaitingInvoiceCaptcha = false;
    this.invoiceCheckout();
  }

  invoiceCheckout() {
    if (!this.invoiceFieldsValid()) {
      this.showInvalidFields();
      this._subscriptionData.inProgress = false;
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
        product_id: this.invoiceProductId(),
        quantity: this._subscriptionData.quantity,
        session: this._subscriptionData.session,
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
    this._subscriptionData.invoiceCheckoutModal.open = false;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.inProgress = false;
    this._subscriptionData.shouldTransferToHub = !!this._subscriptionData.returnUrl;
    this.refreshToken();
  }

  onPostFailed(error) {
    this._subscriptionData.errorMessage = error;
    this._subscriptionData.inProgress = false;
  }

  updatePaymentMethod(locale) {
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    this._subscriptionData.shouldTransferToHub = false;
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
    // a stale transfer intent from an earlier action must not redirect after this refresh
    this._subscriptionData.shouldTransferToHub = false;
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
    this._subscriptionData.changeSeatsModal.invoicePreview = null;
    this._subscriptionData.changeSeatsModal.confirmation = false;
    this._subscriptionData.changeSeatsModal.open = true;
  }

  askForChangeSeatsConfirmation() {
    if (!$(this._form)[0].checkValidity()) {
      this.showInvalidFields();
      return;
    }

    this._subscriptionData.changeSeatsModal.confirmation = true;
    if (this._subscriptionData.details.processor == 'PADDLE_CLASSIC' || this._subscriptionData.details.processor == 'ESPOCRM') {
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
      this._subscriptionData.changeSeatsModal.invoicePreview = data.prorated_amount != null ? data : null;
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
    this._subscriptionData.needsTokenRefresh = true;
    this._subscriptionData.inProgress = true;
    this._subscriptionData.errorMessage = '';
    $.ajax({
      url: GET_LICENSE_URL,
      type: 'GET',
      data: {
        session: this._subscriptionData.session,
        legacy: this._subscriptionData.tokenTransfer === 'queryParam'
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
      // Expected for a card checkout until Paddle's payment webhook links the session to the new
      // billing; the license block then offers a retry.
      this._subscriptionData.errorMessage = xhr.responseJSON?.message || 'Refreshing license failed.';
      this._subscriptionData.needsTokenRefresh = false;
      this._subscriptionData.inProgress = false;
    });
  }

  transferTokenToHub() {
    if (this._subscriptionData.tokenTransfer === 'queryParam') {
      location.href = this._subscriptionData.returnUrl + '?token=' + encodeURIComponent(this._subscriptionData.token);
    } else if (this._subscriptionData.tokenTransfer === 'session') {
      // Hand the Hub the billing session id instead; it resolves the license itself.
      location.href = this._subscriptionData.returnUrl + '?session=' + encodeURIComponent(this._subscriptionData.session);
    } else {
      console.error('Unknown token transfer method:', this._subscriptionData.tokenTransfer);
    }
  }

}
