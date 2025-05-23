"use strict";

// requires newsletter.js
const REQUEST_HUB_MANAGED_URL = STORE_API_URL + '/hub/request-managed';
const VALIDATE_HUB_MANAGED_REQUEST_URL = STORE_API_URL + '/hub/validate-managed-request';

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
    }).done(_ => {
      this.onValidationSucceeded();
    }).fail(xhr => {
      this.onValidationFailed(xhr.responseJSON?.message || 'Validating email failed.');
    });
  }

  validateTeamAndSubdomain() {
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
        team: this._submitData.team,
        subdomain: this._submitData.subdomain
      }
    }).done(_ => {
      this.onValidationSucceeded();
    }).fail(xhr => {
      this.onValidationFailed(xhr.responseJSON?.message || 'Validating team and subdomain failed.');
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
        subscribeToNewsletter(this._submitData.email, 7);
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

function teamToSubdomain(team) {
  // Convert to lowercase
  let subdomain = team.toLowerCase();
  // Replace German specific characters
  subdomain = subdomain.replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");
  // Normalize to decompose accented characters and remove diacritics
  subdomain = subdomain.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Replace any whitespace (including spaces, tabs, etc.) with a hyphen
  subdomain = subdomain.replace(/\s+/g, "-");
  // Remove any characters that are not letters, numbers, or hyphens
  subdomain = subdomain.replace(/[^a-z0-9-]/g, "");
  // Replace multiple hyphens with a single hyphen
  subdomain = subdomain.replace(/-+/g, "-");
  // Remove any leading or trailing hyphens
  subdomain = subdomain.replace(/^-+/, "").replace(/-+$/, "");
  // Cap the subdomain at 63 characters
  if (subdomain.length > 63) {
    subdomain = subdomain.slice(0, 63);
    // Remove any trailing hyphen after truncation
    subdomain = subdomain.replace(/-+$/, "");
  }
  return subdomain;
}

function subdomainToURL(subdomain) {
  return `https://${subdomain}.cryptomator.cloud`;
}
