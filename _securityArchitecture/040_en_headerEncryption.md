---
language: en
anchor: headerEncryption
title: File Header Encryption
---
<p class="lead">The file header stores certain metadata, which is needed for file content encryption. It consists of 88 bytes.</p>

- 16 bytes nonce used during header payload encryption
- 40 bytes <a href="https://en.wikipedia.org/wiki/Block_cipher_modes_of_operation#Counter_.28CTR.29">AES-CTR</a> encrypted payload consisting of:
  - 8 bytes file size
  - 32 bytes file content key
- 32 bytes header MAC of the previous 56 bytes

<pre>
headerNonce := createRandomBytes(16)
contentKey := createRandomBytes(32)
cleartextPayload := bigEndian(fileSize) . contentKey
ciphertextPayload := aesCtr(cleartextPayload, encryptionMasterKey, headerNonce)
mac := hmacSha256(headerNonce . ciphertextPayload, macMasterKey)
</pre>

<img src="/img/architecture/file-header-encryption.png" srcset="/img/architecture/file-header-encryption.png 1x, /img/architecture/file-header-encryption@2x.png 2x" alt="File Header Encryption" />
<figcaption>* Random per file change</figcaption>
