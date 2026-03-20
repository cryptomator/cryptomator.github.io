"use strict";

class ApiForm {

  constructor(form, feedbackData, submitData, url) {
    this._form = form;
    this._feedbackData = feedbackData;
    this._submitData = submitData;
    this._url = url;
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
      url: this._url,
      type: 'POST',
      data: JSON.stringify(this._submitData),
      contentType: "application/json; charset=utf-8",
    }).done(_ => {
      this.onRequestSucceeded();
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
