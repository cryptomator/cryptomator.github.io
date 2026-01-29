"use strict";

const API_BASE_URL = '{{ .Site.Params.apiBaseUrl }}';
const PADDLE_ENABLE_SANDBOX = {{ .Site.Params.paddleEnableSandbox }};
const PADDLE_TOKEN = '{{ .Site.Params.paddleToken }}';
const PADDLE_VENDOR_ID = {{ .Site.Params.paddleVendorId }};
const PADDLE_DESKTOP_PRICE_IDS = {{ .Site.Params.paddleDesktopPriceIds | jsonify }};
const PADDLE_ANDROID_PRICE_ID = '{{ .Site.Params.paddleAndroidPriceId }}';
const PADDLE_HUB_SELF_HOSTED_YEARLY_PLAN_ID = {{ .Site.Params.paddleHubSelfHostedYearlyPlanId }};
const PADDLE_HUB_SELF_HOSTED_MONTHLY_PLAN_ID = {{ .Site.Params.paddleHubSelfHostedMonthlyPlanId }};
const PADDLE_HUB_MANAGED_YEARLY_PLAN_ID = {{ .Site.Params.paddleHubManagedYearlyPlanId }};
const PADDLE_HUB_MANAGED_MONTHLY_PLAN_ID = {{ .Site.Params.paddleHubManagedMonthlyPlanId }};
const PADDLE_PRICES_URL = '{{ .Site.Params.paddlePricesUrl }}';
const PADDLE_DISCOUNT_ID = '{{ .Site.Params.paddleDiscountId }}';
const PADDLE_DISCOUNT_CODE = '{{ .Site.Params.paddleDiscountCode }}';
const LEGACY_STORE_URL = '{{ .Site.Params.legacyStoreUrl }}';
const STRIPE_PK = '{{ .Site.Params.stripePk }}';
