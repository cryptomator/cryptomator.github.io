"use strict";

// requires newsletter.js
const REQUEST_HUB_MANAGED_URL = LEGACY_STORE_URL + '/hub/request-managed';
const VALIDATE_HUB_MANAGED_REQUEST_URL = LEGACY_STORE_URL + '/hub/validate-managed-request';

class HubManaged {

  constructor(form, feedbackData, submitData) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
  }

  validateEmail() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: VALIDATE_HUB_MANAGED_REQUEST_URL,
      type: 'GET',
      data: {
        email: this._submitData.email
      }
    }).done(response => {
      if (response.isCompanyEmail && response.domainWithoutSuffix) {
        this._submitData.subdomain = response.domainWithoutSuffix;
      } else {
        this._submitData.subdomain = '';
      }
      this.onValidationSucceeded();
    }).fail(xhr => {
      this.onValidationFailed(xhr.responseJSON?.message || 'Validating email failed.');
    });
  }

  validateSubdomain() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: VALIDATE_HUB_MANAGED_REQUEST_URL,
      type: 'GET',
      data: {
        subdomain: this._submitData.subdomain
      }
    }).done(_ => {
      this.onValidationSucceeded();
    }).fail(xhr => {
      this.onValidationFailed(xhr.responseJSON?.message || 'Validating subdomain failed.');
    });
  }

  validateQuantity() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: VALIDATE_HUB_MANAGED_REQUEST_URL,
      type: 'GET',
      data: {
        quantity: this._submitData.quantity
      }
    }).done(_ => {
      this.onValidationSucceeded();
    }).fail(xhr => {
      this.onValidationFailed(xhr.responseJSON?.message || 'Validating quantity failed.');
    });
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

  request() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.success = false;
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    $.ajax({
      url: REQUEST_HUB_MANAGED_URL,
      type: 'POST',
      data: this._submitData
    }).done(_ => {
      this.onRequestSucceeded();
      if (this._submitData.acceptNewsletter) {
        subscribeToNewsletter(this._submitData.email, 7); // FIXME move to backend
      }
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Requesting Hub Managed failed.');
    });
  }

  onRequestFailed(error) {
    this._feedbackData.success = false;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = error;
  }

  onRequestSucceeded() {
    this._feedbackData.success = true;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = '';
    window.scrollTo(0, 0);
  }

}

function subdomainToURL(subdomain) {
  return `https://${subdomain}.cryptomator.cloud`;
}
