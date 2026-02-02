"use strict";

// requires newsletter.js
const VERIFY_EMAIL_URL = API_BASE_URL + '/connect/email/verify';
const REFRESH_LICENSE_URL = API_BASE_URL + '/licenses/hub/refresh';

class HubCE {

  constructor(form, feedbackData, submitData, searchParams) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
    this._searchParams = searchParams;
    this._submitData.oldLicense = searchParams.get('oldLicense');

    // continue after email verified:
    if (searchParams.get('verifiedEmail')) {
      feedbackData.currentStep = 1;
      feedbackData.emailVerified = true;
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
        oldLicense: this._submitData.oldLicense,
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

  getHubLicense() {
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: REFRESH_LICENSE_URL,
      type: 'POST',
      data: {
        token: this._submitData.oldLicense,
        captcha: this._submitData.captcha
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