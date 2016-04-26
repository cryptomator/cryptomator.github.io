---
language: en
anchor: contentEncryption
title: File Content Encryption
---
<p class="lead">This is where your actual file contents get encrypted.</p>

The cleartext is broken down into multiple chunks, each up to 32 KiB + 48 bytes consisting of:

<ul>
  <li>16 bytes nonce</li>
  <li>up to 32 KiB encrypted payload using AES-CTR with the file content key</li>
  <li>
    32 bytes MAC of
    <ul>
      <li>file header nonce (to bind this chunk to the file header)</li>
      <li>chunk number as 8 byte big endian integer (to prevent reordering)</li>
      <li>nonce</li>
      <li>encrypted payload</li>
    </ul>
  </li>
</ul>

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
