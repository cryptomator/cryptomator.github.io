"use strict";

const PADDLE_ENABLE_SANDBOX = true;
const PADDLE_VENDOR_ID = 1385;
const PADDLE_DESKTOP_PRODUCT_IDS = [54582, 54583, 54584];
const PADDLE_ANDROID_PRODUCT_ID = 9642;
const PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID = 23141;
const PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID = 42235;
const PADDLE_PRICES_URL = 'https://sandbox-checkout.paddle.com/api/2.0/prices';
const STORE_API_URL = 'http://localhost:8787/api';
const STRIPE_PK = 'pk_test_JhF3MoFQGw2Is0DB3BSv345P';
const STRIPE_PLANS = {'EUR': 'plan_GgVY2JfD49bc02', 'USD': 'plan_GgVZwj545E0uH3'};
const STRIPE_PHP_URL = 'http://localhost/stripe/prepare_payment.php';
