---
language: de
anchor: headerEncryption
title: Verschlüsselung des Dateikopfs
---
<p class="lead">Der Dateikopf enthält Metadaten, die für die Verschlüsselung des Dateiinhalts benötigt werden. Er besteht aus 88 Bytes.</p>

- 16 Bytes mit nonce, die für die Verschlüsselung der Kopfdaten verwendet wird
- 40 Bytes mit <a href="https://de.wikipedia.org/wiki/Counter_Mode">AES-CTR</a> verschlüsselte Kopfdaten, bestehend aus:
  - 8 Bytes gefüllt mit 1 für den zukünftigen Gebrauch (früher benutzt für die Dateigröße)
  - 32 Bytes mit dem Dateiinhalteschlüssel
- 32 Bytes mit dem MAC der vorhergehenden 56 Bytes

Jede Datei wird mit einem eigenen Dateischlüssel verschlüsselt. Dieser wird ebenfalls im Dateikopf abgelegt.

<pre>
headerNonce := createRandomBytes(16)
contentKey := createRandomBytes(32)
cleartextPayload := 0xFFFFFFFFFFFFFFFF . contentKey
ciphertextPayload := aesCtr(cleartextPayload, encryptionMasterKey, headerNonce)
mac := hmacSha256(headerNonce . ciphertextPayload, macMasterKey)
</pre>

<img class="article-img" src="/img/architecture/file-header-encryption.png" srcset="/img/architecture/file-header-encryption.png 1x, /img/architecture/file-header-encryption@2x.png 2x" alt="Verschlüsselung des Dateikopfes" />
<figcaption>* Zufällig bei jeder Dateiänderung</figcaption>
