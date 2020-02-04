"use strict";

/**
 * Lazily load reCAPTCHA and initialize it in the given wrapper element
 * @param {*} wrapper A <div> or other element in which the reCAPTCHA iframe will get injected.
 * @param {*} resultObj An object whose 'value' property will be set to the captcha: `{ value: 'asdasdasd' }`
 */
function loadRecaptcha(wrapper, resultObj) {
    window.grecaptchaCallback = () => {
        $(wrapper).empty();
        grecaptcha.render(wrapper, {
            'sitekey': '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv',
            'data-size': 'compact',
            'callback': (captcha) => resultObj.value = captcha
        });
    }
    $.getScript("https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit");
}

const STRIPE_PK = 'pk_live_eSasX216vGvC26GdbVwA011V';

class CreditCard {

    /**
     * Lazily load Stripe and replace the given placholder form field with a Stripe Elements' auto-validating Credit Card field.
     * @param {*} placeholder A placeholder <input> that will get hidden once Stripe is fully initialized
     * @param {*} status A object to which status changes will be written: `{ cardValidation: 'Wrong CVC', paymentError: 'Payment failed.', success: false }`
     */
    constructor(placeholder, status) {
        this._placeholder  = placeholder;
        this._status = status;
        this._cardElement = document.createElement('div');

        // initialize:
        $(this._cardElement).hide();
        $(this._placeholder).after(this._cardElement);
        $(this._placeholder).attr('placeholder', 'Loading...');
        this._stripe = $.ajax({
            url: 'https://js.stripe.com/v3/',
            cache: true,
            dataType: 'script'
        }).then(response => {
            return window.Stripe(STRIPE_PK);
        });
        this._card = this._stripe.then(stripe => {
            let card = stripe.elements().create('card');
            card.mount(this._cardElement);
            card.on('ready', this.onCardReady.bind(this));
            card.on('change', this.onCardChanged.bind(this));
            return card;
        });
    }

    /**
     * Called as soon as the credit card input field initialized and is ready to be shown
     */
    onCardReady(asd) {
        $(this._cardElement).show();
        $(this._placeholder).hide();
        this._card.then(card => card.focus());
    }

    /**
     * Called when the value of the credit card field changes
     * @param {*} event 
     */
    onCardChanged(event) {
        if (event.error) {
            this._status.cardValidation = event.error.message;
        } else {
            this._status.cardValidation = '';
        }
    }

     /**
      * Attempt charging the card
      * @param {*} amount How much $$$?
      * @param {*} recaptchaToken Captcha required!
      */
    charge(amount, recaptchaToken) {
        Promise.all([this._stripe, this._card]).then(([stripe, card]) => {
            stripe.createPaymentMethod('card', card).then(result => {
                if (result.error) {
                    this._status.paymentError = result.error.message;
                } else {
                    this._status.paymentError = '';
                    this.chargeWithPaymentId(amount, recaptchaToken, result.paymentMethod.id);
                }
            });
        });
    }

    /**
      * Attempt charging the card
      * @param {*} amount How much $$$?
      * @param {*} recaptchaToken Captcha required!
      * @param {*} paymentMethodId ID of the payment method previously created
      */
    chargeWithPaymentId(amount, recaptchaToken, paymentMethodId) {
        $.ajax({
            url: 'https://api.cryptomator.org/stripe/charge_creditcard.php',
            type: 'POST',
            data: {
                payment_method_id: paymentMethodId,
                currency: 'EUR', /* TODO */
                amount: amount,
                frequency: 'once', /* TODO */
                name: null, /* recurring only */
                email: null, /* recurring only */
                message: 'test', /* TODO */
                captcha: recaptchaToken
            }
        }).then(response => {
            if (response.data.status == 'ok') {
                this._status.success = true;
            }
        });

    }

}