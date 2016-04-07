---
anchor: 'masterkeyFile'
title: 'Why is the masterkey stored in the cloud?'
language: en
published: true
abstract: 'If you look into the storage location of a Cryptomator vault you will find a file called masterkey.cryptomator.'
---

### What does this file contain?

This file contains encrypted data which is needed to derive the masterkey from your password. The file does not contain the decrypted masterkey itself.


### Is this a security problem?

No. The encrypted key in *masterkey.cryptomator* is not more sensitive than the encrypted files themselves.

For more details on how this exactly works, take a look on our <a href="/architecture/#masterkeyDerivation">security architecture page</a>.
