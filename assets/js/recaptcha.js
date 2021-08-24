"use strict";

const RECAPTCHA_SITEKEY = '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv';

/**
 * @callback grecaptchaRenderCallback
 * @param {string} token The `g-recaptcha-response` token.
 */

/**
 * Lazily load reCAPTCHA and initialize it in the given wrapper element
 * 
 * @param {*} wrapper A <div> or other element in which the reCAPTCHA iframe will get injected.
 * @param {grecaptchaRenderCallback} callback A callback function that will be called when the when the user submits a successful response. The token will be passed as the first argument.
 */
function loadRecaptcha(wrapper, callback) {
  window.grecaptchaCallback = () => {
    $(wrapper).empty();
    grecaptcha.render(wrapper, {
      'sitekey': RECAPTCHA_SITEKEY,
      'data-size': 'compact',
      'callback': callback
    });
  }
  $.getScript('https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit');
}
