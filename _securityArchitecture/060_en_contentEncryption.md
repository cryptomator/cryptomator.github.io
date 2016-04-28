---
language: en
anchor: contentEncryption
title: File Content Encryption
---
<p class="lead">This is where your actual file contents get encrypted.</p>

The cleartext is broken down into multiple chunks, each up to 32 KiB + 48 bytes consisting of:

- 16 bytes nonce
- up to 32 KiB encrypted payload using AES-CTR with the file content key
- 32 bytes MAC of
  - file header nonce (to bind this chunk to the file header)
  - chunk number as 8 byte big endian integer (to prevent reordering)
  - nonce
  - encrypted payload

Afterwards the encrypted chunks are joined preserving the order of the cleartext chunks. The payload of the last chunk may be smaller than 32 KiB.

<pre>
cleartextChunks[] := split(paddedCleartext, 32KiB)
for (int i = 0; i < length(cleartextChunks); i++) {
  chunkNonce := createRandomBytes(16)
  encryptedPayload := aesCtr(cleartextChunks[i], fileKey, chunkNonce)
  mac := hmacSha256(headerNonce . bigEndian(i) . chunkNonce . encryptedPayload, macMasterKey)
  ciphertextChunks[i] := chunkNonce . encryptedPayload . mac
}
encryptedFileContent := join(encryptedChunks[])
</pre>

<img src="/img/architecture/file-content-encryption.png" srcset="/img/architecture/file-content-encryption.png 1x, /img/architecture/file-content-encryption@2x.png 2x" alt="File Content Encryption" />
<figcaption>* Random per chunk change</figcaption>
