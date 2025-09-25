"use strict";

const API_BASE_URL = '{{ .Site.Params.apiBaseURL }}';
const LEGACY_API_URL = '{{ .Site.Params.legacyApiUrl }}';
const PADDLE_ENABLE_SANDBOX = {{ .Site.Params.paddleEnableSandbox }};
const PADDLE_VENDOR_ID = {{ .Site.Params.paddleVendorId }};
const PADDLE_DESKTOP_PRODUCT_IDS = {{ .Site.Params.paddleDesktopProductIds | jsonify }};
const PADDLE_ANDROID_PRODUCT_ID = {{ .Site.Params.paddleAndroidProductId }};
const PADDLE_HUB_SELF_HOSTED_SUBSCRIPTION_PLAN_ID = {{ .Site.Params.paddleHubSelfHostedSubscriptionPlanId }};
const PADDLE_HUB_MANAGED_SUBSCRIPTION_PLAN_ID = {{ .Site.Params.paddleHubManagedSubscriptionPlanId }};
const PADDLE_PRICES_URL = '{{ .Site.Params.paddlePricesUrl }}';
const LEGACY_STORE_URL = '{{ .Site.Params.legacyStoreUrl }}';
const STRIPE_PK = '{{ .Site.Params.stripePk }}';
const STRIPE_PLANS = {{ .Site.Params.stripePlans | jsonify }};
