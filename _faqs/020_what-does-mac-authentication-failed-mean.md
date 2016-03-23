---
anchor: 'macWarning'
title: 'What does MAC authentication failed mean?'
published: true
abstract: 'Cryptomator uses a so-called MAC to detect unauthorized file changes. In this case the file or files listed in this dialog did change.'
---

![MAC Warning Screen](/img/faq/macWarning.png)

### Is this dangerous?
Unauthorized file modification can have two reasons: Either inevitable <a href="http://en.wikipedia.org/wiki/Data_degradation" target="_blank">bit rotting</a>, which is rather harmless from a security standpoint.

Or the file has been compromised by a cyber criminal planning a <a href="http://en.wikipedia.org/wiki/Chosen-ciphertext_attack" target="_blank">chosen ciphertext attack</a> with the intent to crack your key.

### What shall I do?
* Keep calm, nothing has happened yet
* Are multiple files affected at the same time?
* Check your cloud storage provider's access log.
* Do not decrypt affected files, if there is any chance an attacker might be able to read your decrypted contents.

If you suspect a cyber attack, delete the file as soon as possible and empty your trash. The decrypted file must not fall into the hands of the attacker. You might also want to contact your cloud storage provider to get help securing your account.
