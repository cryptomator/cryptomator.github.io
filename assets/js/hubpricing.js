"use strict";

// requires store.js

class HubPricing {

  constructor(data) {
    this._data = data;
  }

  loadPrice() {
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: PADDLE_HUB_SUBSCRIPTION_PLAN_ID
      },
    }).done(data => {
      this._data.monthlyPrice = {
        amount: data.response.products[0].price.gross / 12,
        currency: data.response.products[0].currency
      };
    });
  }

}
