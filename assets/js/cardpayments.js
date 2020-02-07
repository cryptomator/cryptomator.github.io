"use strict";

const STRIPE_PK = 'pk_live_eSasX216vGvC26GdbVwA011V';
const STRIPE_PLANS = {'EUR': 'plan_GgW4ovr7c6upzx', 'USD': 'plan_GgW49BkhumHMIR'}; // live

//const STRIPE_PK = 'pk_test_JhF3MoFQGw2Is0DB3BSv345P';
//const STRIPE_PLANS = {'EUR': 'plan_GgVY2JfD49bc02', 'USD': 'plan_GgVZwj545E0uH3'}; // test

const RECAPTCHA_SITEKEY = '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv';

class OneTimePayment {

    /**
     * Lazily load Stripe and replace the given placholder form field with a Stripe Elements' auto-validating Credit Card field.
     * @param {*} placeholder A placeholder <input> that will get hidden once Stripe is fully initialized
     * @param {*} paymentData An object to which status changes will be written: `{amount: 20, currency: 'EUR', captcha: 'asd', errorMessage: 'Wrong CVC', success: false, inProgress: false }`
     * @param {*} placeholderLoading Localized string used as placeholder for the placeholder <input> when Stripe is being loaded
     * @param {*} languageCode The IETF language tag of the locale to display Stripe placeholders and error strings in
     */
    constructor(placeholder, paymentData, placeholderLoading, languageCode) {
        this._placeholder  = placeholder;
        this._paymentData = paymentData;
        this._cardElement = document.createElement('div');

        // initialize:
        $(this._cardElement).hide();
        $(this._placeholder).after(this._cardElement);
        $(this._placeholder).attr('placeholder', placeholderLoading);
        $(this._placeholder).attr('disabled', true);
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
            card.mount(this._cardElement);
            card.on('ready', this.onCardReady.bind(this));
            card.on('change', this.onCardChanged.bind(this));
            return card;
        });
    }

    /**
     * Called as soon as the credit card input field initialized and is ready to be shown
     */
    onCardReady() {
        $(this._cardElement).show();
        $(this._placeholder).hide();
        this._card.then(card => card.focus());
    }

    /**
     * Called when the value of the credit card field changes
     * @param {*} event 
     */
    onCardChanged(event) {
        this._paymentData.validCardNum = event.complete;
        if (event.error) {
            this._paymentData.errorMessage = event.error.message;
        } else {
            this._paymentData.errorMessage = '';
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
                'callback': (captcha) => this._paymentData.captcha = captcha
            });
        }
        $.getScript("https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit");
    }

     /**
      * Attempt charging the card
      */
    charge() {
        // TODO plausibility checks in this._paymentData.captcha (captcha set? amount is integer? currency is EUR/USD?)
        this._paymentData.inProgress = true;
        this._paymentData.errorMessage = '';
        this._paymentData.success = false;
        Promise.all([this._stripe, this._card]).then(([stripe, card]) => {
            stripe.createPaymentMethod('card', card).then(result => {
                if (result.error) {
                    this.onPaymentFailed(result.error.message);
                } else {
                    this.chargeWithPaymentId(result.paymentMethod.id);
                }
            });
        });
    }

    /**
      * Attempt charging the card
      * @param {*} paymentMethodId ID of the payment method previously created
      */
    chargeWithPaymentId(paymentMethodId) {
        $.ajax({
            url: 'http://api.cryptomator.org/stripe/charge_creditcard.php',
            type: 'POST',
            data: {
                payment_method_id: paymentMethodId,
                currency: this._paymentData.currency,
                amount: this._paymentData.amount,
                frequency: 'once',
                message: 'Good job, team! TODO replace default message in cardpayments.js', /* TODO */
                captcha: this._paymentData.captcha
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
     * @param {*} paymentIntendId 
     */
    chargeWithPaymentIntendId(paymentIntendId) {
        $.ajax({
            url: 'http://api.cryptomator.org/stripe/charge_creditcard.php',
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
     * @param {*} paymentIntendClientSecret 
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
     * @param {*} paymentIntendClientSecret 
     * @param {*} paymentMethod 
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
        this._paymentData.success = false;
        this._paymentData.errorMessage = error;
        this._paymentData.inProgress = false;
        if (grecaptcha) {
            this._paymentData.captcha = '';
            grecaptcha.reset();
        }
    }

    onPaymentSucceeded() {
        this._paymentData.success = true;
        this._paymentData.errorMessage = '';
        this._paymentData.inProgress = false;
        if (grecaptcha) {
            this._paymentData.captcha = '';
            grecaptcha.reset();
        }
    }

}

class RecurringPayment {

    /**
     * Creates a new recurring payment object.
     * @param {*} amount integer $$$
     * @param {*} currency EUR or USD
     */
    constructor(amount, currency){
        this._amount = parseInt(amount);
        this._plan = STRIPE_PLANS[currency];
        this._stripe = $.ajax({
            url: 'https://js.stripe.com/v3/',
            cache: true,
            dataType: 'script'
        }).then(response => {
            return window.Stripe(STRIPE_PK);
        });
    }
    
    checkout() {
        this._stripe.then(stripe => {
            stripe.redirectToCheckout({
                items: [
                    {plan: this._plan, quantity: this._amount}
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
