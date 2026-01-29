"use strict";

class HubPricing {

  constructor(data) {
    this._data = data;
  }

  loadPrice() {
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: `${PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID},${PADDLE_HUB_MANAGED_YEARLY_PLAN_ID}`
      },
    }).done(data => {
      this._data.selfHostedMonthlyPrice = {
        amount: data.response.products[0].subscription.price.net / 12,
        currency: data.response.products[0].currency
      };
      this._data.managedMonthlyPrice = {
        amount: data.response.products[1].subscription.price.net / 12,
        currency: data.response.products[1].currency
      };
    });
  }

}
