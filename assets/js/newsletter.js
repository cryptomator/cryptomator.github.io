"use strict";

const SUBSCRIBE_NEWSLETTER_URL = BASE_API_URL + '/listmonk/subscribe.php';

class Newsletter {

  constructor(form, data) {
    this._form = form;
    this._data = data;
  }
  
  subscribe() {
    if (!$(this._form)[0].checkValidity()) {
      $(this._form).find(':input').addClass('show-invalid');
      this._data.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this._data.inProgress = true;
    this._data.errorMessage = '';
    this._data.success = false;
    subscribeToNewsletter(
      this._data.email, this._data.listId
    ).done(() => {
      this.onSubscribeSucceeded();
    }).fail(xhr => {
      this.onSubscribeFailed(xhr.responseJSON?.message || 'Subscribing to newsletter failed.');
    });
  }

  onSubscribeFailed(error) {
    this._data.success = false;
    this._data.errorMessage = error;
    this._data.inProgress = false;
  }

  onSubscribeSucceeded() {
    this._data.success = true;
    this._data.errorMessage = '';
    this._data.inProgress = false;
  }
}

function subscribeToNewsletter(email, listId) {
  return $.ajax({
    url: SUBSCRIBE_NEWSLETTER_URL,
    type: 'GET',
    xhrFields: {
      withCredentials: true
    }
  }).then(() => {
    return $.ajax({
      url: SUBSCRIBE_NEWSLETTER_URL,
      type: 'POST',
      data: {
        email: email,
        listid: listId
      },
      xhrFields: {
        withCredentials: true
      }
    });
  });
}
