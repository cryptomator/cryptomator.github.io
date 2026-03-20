"use strict";

class HubPricing {

  constructor(data) {
    this._data = data;
  }

  loadPrices() {
    $.ajax({
      url: PADDLE_PRICES_URL,
      dataType: 'jsonp',
      data: {
        product_ids: `${PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID},${PADDLE_HUB_SELF_HOSTED_MONTHLY_PLAN_ID},${PADDLE_HUB_MANAGED_YEARLY_PLAN_ID},${PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID}`
      },
    }).done(data => {
      const priceMap = {};
      data.response.products.forEach(p => {
        priceMap[p.product_id] = {
          amount: p.subscription.price.net,
          currency: p.currency
        };
      });

      this._assignPrice(priceMap, PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID, 'selfHostedYearlyPrice', 12);
      this._assignPrice(priceMap, PADDLE_HUB_SELF_HOSTED_MONTHLY_PLAN_ID, 'selfHostedMonthlyPrice', 1);
      this._assignPrice(priceMap, PADDLE_HUB_MANAGED_YEARLY_PLAN_ID, 'managedYearlyPrice', 12);
      this._assignPrice(priceMap, PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID, 'managedMonthlyPrice', 1);

      const mYearly = priceMap[PADDLE_HUB_MANAGED_YEARLY_PLAN_ID];
      const mMonthly = priceMap[PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID];
      if (mYearly && mMonthly) {
        this._data.savingsPercent = Math.max(0, Math.round((1 - mYearly.amount / (mMonthly.amount * 12)) * 100));
      }
    });
  }

  _assignPrice(priceMap, planId, dataKey, divisor) {
    const price = priceMap[planId];
    if (price) {
      this._data[dataKey] = {
        amount: price.amount / divisor,
        currency: price.currency
      };
    }
  }

}
