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
        product_ids: `${PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID},${PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID}`
      },
    }).done(data => {
      this._data.selfHostedMonthlyPrice = {
        amount: data.response.products[0].subscription.price.gross / 12,
        currency: data.response.products[0].currency
      };
      this._data.managedMonthlyPrice = {
        amount: data.response.products[1].subscription.price.gross / 12,
        currency: data.response.products[1].currency
      };
    });
  }

}
