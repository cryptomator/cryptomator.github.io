---
language: en
context: nav

navbar:
  toggle: Toggle navigation
  download: Download
  security: Security
  coop: Cooperations
  support: Support
  enterprise: Enterprise
  sponsors: Sponsors
  donate: Donate

payment:
  type:
    creditCard: Credit Card
    bankTransfer: Bank Transfer
  paypal:
    paymentHint: >
      After pressing &quot;Proceed&quot;, you will be redirected to our PayPal site.
    amount: Amount
    message: Message (optional)
    proceedBtn: Proceed to PayPal
  creditCard:
    paymentHint1: >
      Credit card payments are securely handled by <a href="https://stripe.com" target="_blank">Stripe</a>. We will not be able to see your card number or CVC.
      Please expect to be <a href="https://support.stripe.com/questions/i-have-a-charge-on-my-card-from-stripe-but-i-m-not-a-stripe-user" target="_blank">charged by Stripe</a>.
    paymentHint2: >
      <strong>Important:</strong> Credit card plausibility checks might fail when using anonymizing services such as proxies or Tor.
    amount: Amount
    message: Message (optional)
    card: Credit Card
    loadingStripe: Loading Stripe…
    payNowBtn: Pay Now
    processingBtn: Processing…
    successful: Hooray!
    successfulMessage: >
      Thank you for your donation to Cryptomator! Your payment was successful and you'll get to the Downloads page in the next step. Happy crypting! :tada:
  bankTransfer:
    recipient: Recipient
  crypto:
    paymentHint: >
      Select the crypto currency in the next step.
      After pressing &quot;Proceed&quot;, you will be redirected to our CoinPayments site.
    amount: Amount (Fiat)
    proceedBtn: Proceed to CoinPayments
  cancelBtn: Cancel
  proceedToDownloads: Proceed to Downloads
---
