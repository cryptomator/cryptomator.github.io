"use strict";

/**
 * Lazily load reCAPTCHA and initialize it in the given wrapper element
 * @param {*} wrapper A <div> or other element in which the reCAPTCHA iframe will get injected.
 */
function loadRecaptcha(wrapper) {
    let recaptchaCallback = function(result) {
        console.log('recaptchaCallback', result);
        // TODO
    };
    window.grecaptchaCallback = function() {
        $(wrapper).empty();
        grecaptcha.render(wrapper, {
        'sitekey': '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv',
        'data-size': 'compact',
        'callback' : recaptchaCallback
        });
    }

    $.getScript("https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit");
}

/**
 * Lazily load Stripe and replace the given placholder form field with a Stripe Elements' auto-validating Credit Card field.
 * @param {*} placeholder A placeholder <input> that will get hidden once Stripe is fully initialized
 * @param {*} statusText A <p> or <span> in which validation messages (such as wrong CVC) will get displayed.
 */
function loadStripe(placeholder, statusText) {
    let cardElement = document.createElement('div');
    $(cardElement).hide();
    $(placeholder).after(cardElement);
    $(placeholder).attr('placeholder', 'Loading...');
    $.getScript("https://js.stripe.com/v3/", () => {
        let stripe = window.Stripe('pk_live_eSasX216vGvC26GdbVwA011V');
        let card = stripe.elements().create('card');
        card.mount(cardElement);
        card.on('ready', () => {
        $(cardElement).show();
        $(placeholder).hide();
        card.focus();
        });
        card.on('change', (event) => {
        if (event.error) {
            $(statusText).text(event.error.message);
        } else {
            $(statusText).text('');
        }
        });
    });
}