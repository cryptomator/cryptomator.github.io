---
language: de
anchor: headerEncryption
title: Headers verschlüsseln
---
<p class="lead">The file header stores certain metadata, which is needed for file content encryption. It consists of 88 bytes.</p>

<ul>
  <li>16 bytes nonce used during header payload encryption</li>
  <li>
    40 bytes AES-CTR encrypted payload consisting of:
    <ul>
      <li>8 bytes file size</li>
      <li>32 bytes file content key</li>
    </ul>
  </li>
  <li>32 bytes header MAC of the previous 56 bytes</li>
</ul>

<pre>
headerNonce := createRandomBytes(16)
contentKey := createRandomBytes(32)
cleartextPayload := bigEndian(fileSize) . contentKey
ciphertextPayload := aesCtr(cleartextPayload, encryptionMasterKey, headerNonce)
mac := hmacSha256(headerNonce . ciphertextPayload, macMasterKey)
</pre>
