"use strict";

// requires store.js
const REQUEST_HUB_DEMO_URL = STORE_API_URL + '/hub/request-demo';

class HubDemo {

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
      url: REQUEST_HUB_DEMO_URL,
      type: 'POST',
      data: this._submitData
    }).done(data => {
      this.onRequestSucceeded(data);
    }).fail(xhr => {
      this.onRequestFailed(xhr.responseJSON?.message || 'Requesting Hub Demo failed.');
    });
  }

  onRequestFailed(error) {
    this._feedbackData.success = false;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = error;
  }

  onRequestSucceeded(data) {
    this._feedbackData.url = data.url;
    this._feedbackData.username = data.username;
    this._feedbackData.password = data.password;
    this._feedbackData.success = true;
    this._feedbackData.inProgress = false;
    this._feedbackData.errorMessage = '';
    window.scrollTo(0, 0);
  }

}
