"use strict";

const REQUEST_HUB_CONTACT_URL = STORE_API_URL + '/hub/request-contact';

class HubContact {

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

    this._feedbackData.success = false;
    this._feedbackData.inProgress = true;
    this._feedbackData.errorMessage = '';

    $.ajax({
      url: REQUEST_HUB_CONTACT_URL,
      type: 'POST',
      data: this._submitData
    }).done(_ => {
      this.onRequestSucceeded();
      if (this._submitData.acceptNewsletter) {
        subscribeToNewsletter(this._submitData.email, 7);
      }
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Request failed.');
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