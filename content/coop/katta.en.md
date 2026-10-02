---
title: "Katta"
prio: 5
img: /img/coop/katta.png
img2x: /img/coop/katta@2x.png
description: "Katta turns your S3 storage into a secure workspace for teams. It combines the native filesystem integration of Mountain Duck with the zero-knowledge key management of Cryptomator Hub."
ctalink: https://katta.cloud/
ctatext: "Visit katta.cloud"
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/coop/katta-banner.jpg" alt="Mountain Duck plus Cryptomator Hub equals Katta"/>
</figure>

Katta is a complete encryption solution for S3 storage, made for teams and organizations. Katta Desktop mounts your vaults as a local disk on macOS and Windows and keeps them in sync, so you don't need an additional sync client. Any S3-compatible storage is supported. For AWS and MinIO, Katta additionally issues temporary credentials that are limited to the bucket of a single vault.

We are excited about this cooperation because it brings together two products that have been complementing each other for years: Katta Desktop is based on Mountain Duck, Katta Server is based on Cryptomator Hub. Your files are encrypted on your device before they are uploaded to your S3 bucket, and the keys reach the server only in encrypted form. Neither the storage provider nor the operator of the server can read your data.

Cryptomator Hub manages the keys to your vaults, but leaves it up to you where the vaults are stored and how they are synchronized. Katta goes one step further: Katta Server also knows where each vault is stored, and being a member of a vault is what grants access to its storage. Just like Cryptomator Hub, it integrates into your existing identity management, including OpenID Connect, SAML, and LDAP.

Thus, Katta is the perfect choice for teams that want to keep their data in their own S3 buckets and get started with minimal configuration.

Katta Server and the Katta client library are open-source software, too. Vaults are created in the {{< extlink "https://github.com/encryption-alliance/unified-vault-format" "Unified Vault Format" >}}, an open and vendor-independent standard for encrypted directories. It is based on the proven vault format of Cryptomator, and we are developing it together with the developers of Cyberduck, gocryptfs, and rclone.

Katta is currently in soft launch. You can {{< extlink "https://katta.cloud/demo/" "try the demo" >}} on a live Katta instance without signing up, or join the waitlist to be among the first when Katta launches publicly.
