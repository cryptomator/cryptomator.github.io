---
title: Why is the masterkey stored in the cloud?
published: false
---
If you look into the storage location of a Cryptomator vault you will find a file called *masterkey.cryptomator*.

### What does this file contain?

This file contains the key which is used to encrypt the files in the vault. The key itself is encrypted using your password.


### Is this a security problem?

No. The encrypted key in *masterkey.cryptomator* is as sensitive as the encrypted files itself.

For more details on how this exactly works, have a look on our <a href="/architecture/#virtualFilesystem">security architecture page</a>.
