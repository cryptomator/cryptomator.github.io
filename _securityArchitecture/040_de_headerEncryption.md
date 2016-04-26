---
language: de
anchor: headerEncryption
title: Dateikopf verschlüsseln
---
<p class="lead">Der Dateikopf enthält Metadaten, die für die Verschlüsselung des Dateiinhalts benötigt werden. Er besteht aus 88 Bytes.</p>

<ul>
  <li>16 Bytes mit nonce, die für die Verschlüsselung der Kopfdaten verwendet wird</li>
  <li>
    40 Bytes mit <a href="https://de.wikipedia.org/wiki/Counter_Mode">AES-CTR</a> verschlüsselte Kopfdaten, bestehend aus:
    <ul>
      <li>8 Bytes mit der Dateigröße</li>
      <li>32 Bytes mit dem Dateiinhalteschlüssel</li>
    </ul>
  </li>
  <li>32 Bytes mit dem MAC der vorhergehenden 56 Bytes</li>
</ul>

Die Dateigröße wird im Dateikopf gespeichert, da die echte Dateigröße verschleiert wird. Dies wird im nächsten Abschnitt beschrieben. Zudem wird jede Datei jeweils mit einem eigenen Dateischlüssel verschlüsselt. Dieser wird ebenfalls im Dateikopf abgelegt.

<pre>
headerNonce := createRandomBytes(16)
contentKey := createRandomBytes(32)
cleartextPayload := bigEndian(fileSize) . contentKey
ciphertextPayload := aesCtr(cleartextPayload, encryptionMasterKey, headerNonce)
mac := hmacSha256(headerNonce . ciphertextPayload, macMasterKey)
</pre>
