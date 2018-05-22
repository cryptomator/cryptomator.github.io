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
    sepa: SEPA Direct Debit
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
  sepa:
    amount: Amount
    name: Name
    email: Email
    message: Message (optional)
    loadingStripe: Loading Stripe…
    proceedBtn: Pay Now
    paymentHint: >
      By providing your IBAN and confirming this payment, you authorise Skymatic UG and Stripe, our payment service provider to send instructions to your bank to debit your account and your bank to debit your account in accordance with the instructions from Skymatic UG and Stripe.
      As part of your rights, you are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.
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
