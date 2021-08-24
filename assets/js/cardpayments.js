"use strict";

const STRIPE_PK = 'pk_live_eSasX216vGvC26GdbVwA011V';
const STRIPE_PLANS = {'EUR': 'plan_GgW4ovr7c6upzx', 'USD': 'plan_HYOXl2Z3uV5TwB'}; // live
const STRIPE_PHP_URL = 'https://api.cryptomator.org/stripe/prepare_payment.php';

//const STRIPE_PK = 'pk_test_JhF3MoFQGw2Is0DB3BSv345P';
//const STRIPE_PLANS = {'EUR': 'plan_GgVY2JfD49bc02', 'USD': 'plan_GgVZwj545E0uH3'}; // test
//const STRIPE_PHP_URL = 'http://localhost/stripe/prepare_payment.php';

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
            fontFamily: 'Open Sans, sans-serif',
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
   * Attempt charging the card
   * @param {number} amount How many units of the given currency to pay
   * @param {string} currency Which currency to pay in
   */
  charge(amount, currency) {
    this._status.inProgress = true;
    this._status.errorMessage = '';
    this._status.success = false;

    let preparedPayment = $.ajax({
      url: STRIPE_PHP_URL,
      type: 'POST',
      data: {
        currency: currency,
        amount: amount,
        captcha: this._status.captcha
      }
    });

    Promise.all([this._stripe, this._card, preparedPayment]).then(([stripe, card, preparedPayment]) => {
      stripe.confirmCardPayment(preparedPayment.client_secret, {
        payment_method: {
          card: card
        }
      }).then(function(result) {
        if (result.error) {
          this.onPaymentFailed(result.error);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            this.onPaymentSucceeded();
          }
        }
      }.bind(this));
    });
  }

  /**
   * @param {Object} error error object returned by stripe
   * @param {string} error.message error message
   */
  onPaymentFailed(error) {
    console.warn('Stripe payment failed with error', error);
    this._status.success = false;
    this._status.errorMessage = error.message;
    this._status.inProgress = false;
    if (grecaptcha) {
      this._status.captcha = '';
      grecaptcha.reset();
    }
  }

  onPaymentSucceeded() {
    console.info('Stripe payment succeeded!');
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
   * @param {string} languageCode The IETF language tag of the locale to display Stripe placeholders and error strings in
   */
  checkout(amount, currency, languageCode) {
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
        cancelUrl: window.location.href,
        locale: languageCode
      }).then(result => {
        if (result.error) {
          console.log(result.error.message);
        }
      });
    });
  }

}
