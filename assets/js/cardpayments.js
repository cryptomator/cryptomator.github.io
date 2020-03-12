"use strict";

const STRIPE_PK = 'pk_live_eSasX216vGvC26GdbVwA011V';
const STRIPE_PLANS = {'EUR': 'plan_GgW4ovr7c6upzx', 'USD': 'plan_GgW49BkhumHMIR'}; // live

//const STRIPE_PK = 'pk_test_JhF3MoFQGw2Is0DB3BSv345P';
//const STRIPE_PLANS = {'EUR': 'plan_GgVY2JfD49bc02', 'USD': 'plan_GgVZwj545E0uH3'}; // test

const RECAPTCHA_SITEKEY = '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv';

class OneTimePayment {

  /**
   * Initializes the one-time payments helper and stores a references to the status object that can be observed by AlpineJS
   * @param {Object} status 
   * @param {boolean} status.validCardNum Whether the Stripe input field considers the credit card number valid
   * @param {string} status.captcha The captcha (if reCAPTCHA validation finished) or null
   * @param {string} status.errorMessage An error message or null
   * @param {boolean} status.inProgress Whether an async payment task is currently running
   * @param {boolean} status.success Whether the payment succeeded
   */
  constructor(status) {
    this._status = status;
  }

  /**
   * Lazily load Stripe and replace the given placholder form field with a Stripe Elements' auto-validating Credit Card field.
   * @param {Element} placeholder A placeholder <input> that will get hidden once Stripe is fully initialized
   * @param {string} placeholderLoading Localized string used as placeholder for the placeholder <input> when Stripe is being loaded
   * @param {string} languageCode The IETF language tag of the locale to display Stripe placeholders and error strings in
   */
  initStripeField(placeholder, placeholderLoading, languageCode) {
    let cardElement = document.createElement('div');

    // initialize:
    $(cardElement).hide();
    $(placeholder).after(cardElement);
    $(placeholder).attr('placeholder', placeholderLoading);
    $(placeholder).attr('disabled', true);
    this._stripe = $.ajax({
      url: 'https://js.stripe.com/v3/',
      cache: true,
      dataType: 'script'
    }).then(response => {
      return window.Stripe(STRIPE_PK);
    });
    this._card = this._stripe.then(stripe => {
      let card = stripe.elements({
        locale: languageCode
      }).create('card', {
        style: {
          base: {
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: '16px',
            lineHeight: '1.5'
          }
        }
      });
      card.mount(cardElement);
      card.on('ready', event => {
        $(cardElement).show();
        $(placeholder).hide();
        card.focus();
      });
      card.on('change', this.onCardChanged.bind(this));
      return card;
    });
  }
  
  /**
   * Called when the value of the credit card field changes
   * @param {*} event 
   */
  onCardChanged(event) {
    this._status.validCardNum = event.complete;
    if (event.error) {
      this._status.errorMessage = event.error.message;
    } else {
      this._status.errorMessage = '';
    }
  }
  
  /**
   * Lazily load reCAPTCHA and initialize it in the given wrapper element
   * @param {*} wrapper A <div> or other element in which the reCAPTCHA iframe will get injected.
   */
  loadRecaptcha(wrapper) {
    window.grecaptchaCallback = () => {
      $(wrapper).empty();
      grecaptcha.render(wrapper, {
        'sitekey': RECAPTCHA_SITEKEY,
        'data-size': 'compact',
        'callback': (captcha) => this._status.captcha = captcha
      });
    }
    $.getScript("https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit");
  }
  
  /**
   * Attempt charging the card
   * @param {number} amount How many units of the given currency to pay
   * @param {string} currency Which currency to pay in
   */
  charge(amount, currency) {
    // TODO plausibility checks (captcha set? amount is integer? currency is EUR/USD?)
    this._status.inProgress = true;
    this._status.errorMessage = '';
    this._status.success = false;
    Promise.all([this._stripe, this._card]).then(([stripe, card]) => {
      stripe.createPaymentMethod('card', card).then(result => {
        if (result.error) {
          this.onPaymentFailed(result.error.message);
        } else {
          this.chargeWithPaymentId(result.paymentMethod.id, amount, currency);
        }
      });
    });
  }
  
  /**
   * Attempt charging the card
   * @param {string} paymentMethodId ID of the payment method previously created
   * @param {number} amount How many units of the given currency to pay
   * @param {string} currency Which currency to pay in
   */
  chargeWithPaymentId(paymentMethodId, amount, currency) {
    $.ajax({
      url: 'https://api.cryptomator.org/stripe/charge_creditcard.php',
      type: 'POST',
      data: {
        payment_method_id: paymentMethodId,
        currency: currency,
        amount: amount,
        frequency: 'once',
        message: 'Good job, team! TODO replace default message in cardpayments.js', /* TODO */
        captcha: this._status.captcha
      }
    }).done(data => {
      if (data.status == 'ok') {
        this.onPaymentSucceeded();
      } else if (data.status == 'requires_action' && data.confirmation_method == 'manual') {
        this.manuallyConfirmPayment(data.payment_intent_client_secret);
      } else if (data.status == 'requires_action' && data.confirmation_method == 'automatic') {
        this.automaticallyConfirmPayment(data.payment_intent_client_secret, data.payment_method);
      } else {
        this.onPaymentFailed(response.error);
      }
    }).fail(xhr => {
      this.onPaymentFailed(xhr.responseJSON.error);
    });
  }
  
  /**
   * Reattempts charging a previously intended payment, proceeding from where it left of before interrupted by SCA.
   * @param {string} paymentIntendId 
   */
  chargeWithPaymentIntendId(paymentIntendId) {
    $.ajax({
      url: 'https://api.cryptomator.org/stripe/charge_creditcard.php',
      type: 'POST',
      data: {
        payment_intent_id: paymentIntendId,
        message: 'Good job, team! TODO replace default message in cardpayments.js', /* TODO */
      }
    }).done(data => {
      if (data.status == 'ok') {
        this.onPaymentSucceeded();
      } else {
        this.onPaymentFailed(data.error);
      }
    }).fail(xhr => {
      this.onPaymentFailed(xhr.responseJSON.error);
    });
  }
  
  /**
   * Performs manual client-side SCA
   * @param {string} paymentIntendClientSecret 
   */
  manuallyConfirmPayment(paymentIntendClientSecret) {
    this._stripe.then(stripe => {
      stripe.handleCardAction(paymentIntendClientSecret).then(result => {
        if (result.error) {
          this.onPaymentFailed(result.error.message);
        } else {
          this.chargeWithPaymentIntendId(result.paymentIntent.id);
        }
      });
    });
  }
  
  /**
   * Performs automatic client-side SCA
   * @param {string} paymentIntendClientSecret 
   * @param {string} paymentMethod 
   */
  automaticallyConfirmPayment(paymentIntendClientSecret, paymentMethod) {
    this._stripe.then(stripe => {
      stripe.handleCardPayment(paymentIntendClientSecret, { payment_method: paymentMethod }).then(result => {
        if (result.error) {
          this.onPaymentFailed(result.error.message);
        } else {
          this.chargeWithPaymentIntendId(result.paymentIntent.id);
        }
      });
    });
  }
  
  onPaymentFailed(error) {
    this._status.success = false;
    this._status.errorMessage = error;
    this._status.inProgress = false;
    if (grecaptcha) {
      this._status.captcha = '';
      grecaptcha.reset();
    }
  }
  
  onPaymentSucceeded() {
    this._status.success = true;
    this._status.errorMessage = '';
    this._status.inProgress = false;
    if (grecaptcha) {
      this._status.captcha = '';
      grecaptcha.reset();
    }
  }
  
}

class RecurringPayment {
  
  /**
   * Creates a new recurring payment object.
   * @param {number} amount integer $$$
   * @param {string} currency EUR or USD
   */
  checkout(amount, currency) {
    let plan = STRIPE_PLANS[currency];
    $.ajax({
      url: 'https://js.stripe.com/v3/',
      cache: true,
      dataType: 'script'
    }).then(response => {
      return window.Stripe(STRIPE_PK);
    }).then(stripe => {
      stripe.redirectToCheckout({
        items: [
          {plan: plan, quantity: parseInt(amount)}
        ],
        successUrl: window.location.href + '/thanks',
        cancelUrl: window.location.href
      }).then(result => {
        if (result.error) {
          console.log(result.error.message);
        }
      });
    });
  }
  
}
