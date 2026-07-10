"use strict";

// requires newsletter.js
const VERIFY_EMAIL_URL = API_BASE_URL + '/connect/email/verify';
const BILLING_SESSION_URL = API_BASE_URL + '/billing/session';
const GET_LICENSE_URL = API_BASE_URL + '/licenses/hub';

class HubCE {

  constructor(form, feedbackData, submitData, searchParams) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
    this._searchParams = searchParams;
    this._submitData.hubId = searchParams.get('hub_id');
    this._submitData.returnUrl = searchParams.get('return_url');
    this._submitData.session = searchParams.get('session');

    // continue after email verified (returned from the confirmation link with ?session=<id>):
    if (this._submitData.session) {
      feedbackData.currentStep = 1;
      feedbackData.emailVerified = true;
      this.loadBillingSession();
    }
  }

  submit() {
    if (this._feedbackData.currentStep === 0) {
      this.validateEmail();
    } else if (this._feedbackData.currentStep === 1) {
      this.sendConfirmationEmail();
    } else if (this._feedbackData.currentStep === 2) {
      this.getHubLicense();
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
      url: VERIFY_EMAIL_URL,
      type: 'POST',
      data: {
        email: this._submitData.email,
        hubId: this._submitData.hubId,
        returnUrl: this._submitData.returnUrl,
        tokenTransfer: 'session', // Community Edition always delivers the license via the billing session
        verifyCaptcha: this._submitData.captcha,
        verifyEmail: this._submitData.email,
        verifyTarget: 'registerhubce'
      }
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
      // The session is verified; restore its context for the license step and the return to the Hub.
      this._submitData.hubId = data.hubId;
      this._submitData.email = data.email;
      this._submitData.returnUrl = data.returnUrl;
      this._feedbackData.inProgress = false;
      this._feedbackData.errorMessage = '';
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Loading billing session failed.');
    });
  }

  getHubLicense() {
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: GET_LICENSE_URL,
      type: 'GET',
      data: {
        session: this._submitData.session,
        legacy: false
      }
    }).done(response => {
      this._feedbackData.licenseText = response;
      this._feedbackData.inProgress = false;
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Fetching license failed.');
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
