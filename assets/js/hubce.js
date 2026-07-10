"use strict";

// requires newsletter.js
const BILLING_SESSION_URL = API_BASE_URL + '/billing/session';

class HubCE {

  constructor(form, feedbackData, submitData, searchParams) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
    this._searchParams = searchParams;
    this._submitData.hubId = searchParams.get('hub_id');
    this._submitData.returnUrl = searchParams.get('return_url');
    this._submitData.session = searchParams.get('session');

    // returned from the confirmation link with ?session=<id>: resolve the session and finish on the last step
    if (this._submitData.session) {
      feedbackData.currentStep = 2;
      feedbackData.success = true;
      this.loadBillingSession();
    }
  }

  submit() {
    if (this._feedbackData.currentStep === 0) {
      this.validateEmail();
    } else if (this._feedbackData.currentStep === 1) {
      this.sendConfirmationEmail();
    }
  }

  validateEmail() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.onValidationSucceeded();
  }

  onValidationFailed(error) {
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = error;
  }

  onValidationSucceeded() {
    this._feedbackData.currentStep++;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = '';
  }

  sendConfirmationEmail() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.success = false;
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: BILLING_SESSION_URL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        hubId: this._submitData.hubId,
        returnUrl: this._submitData.returnUrl,
        tokenTransfer: 'session', // Community Edition always delivers the license via the billing session
        verificationLinkTarget: 'registerhubce',
        email: this._submitData.email,
        captcha: this._submitData.captcha
      })
    }).done(_ => {
      this.onRequestSucceeded();
      if (this._submitData.acceptNewsletter) {
        subscribeToNewsletter(this._submitData.email, 7); // FIXME move to backend
      }
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Sending confirmation email failed.');
    });
  }

  loadBillingSession() {
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: BILLING_SESSION_URL + '/' + encodeURIComponent(this._submitData.session),
      type: 'GET'
    }).done(data => {
      if (data.tokenTransfer !== 'session') {
        this.onRequestFailed('Unsupported token transfer method: ' + data.tokenTransfer);
        return;
      }
      // The session is verified; restore its context for the return to the Hub, which collects the license itself.
      this._submitData.hubId = data.hubId;
      this._submitData.email = data.email;
      this._submitData.returnUrl = data.returnUrl;
      this._feedbackData.sessionVerified = true;
      this._feedbackData.inProgress = false;
      this._feedbackData.errorMessage = '';
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Loading billing session failed.');
    });
  }

  onRequestFailed(error) {
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = error;
  }

  onRequestSucceeded() {
    this._feedbackData.emailSent = true;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = '';
  }

}
