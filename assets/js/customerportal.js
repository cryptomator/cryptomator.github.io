"use strict";

const REQUEST_CUSTOMER_PORTAL_URL = 'https://api.cryptomator.org/stripe/request_customer_portal.php';

// const REQUEST_CUSTOMER_PORTAL_URL = 'http://localhost/stripe/request_customer_portal.php';

class CustomerPortal {

  constructor(form, feedbackData, submitData) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
  }

  request() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._feedbackData.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';
    this._feedbackData.success = false;
    $.ajax({
      url: REQUEST_CUSTOMER_PORTAL_URL,
      type: 'POST',
      data: this._submitData
    }).done(_ => {
      this.onRequestSucceeded();
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Requesting supporter certificate failed.');
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
  }

}
