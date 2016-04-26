---
language: de
anchor: contentEncryption
title: Inhalt verschlüsseln
---
<p class="lead">Hier wird der aktuelle Dateiinhalt verschlüsselt.</p>

Der unverschlüsselte Dateiinhalt wird in mehrere Stücke zerteilt, jedes bestehend aus 32 KiB. Diese Stücke werden dann jeweils verschlüsselt und folgendermaßen um weitere 48 Bytes ergänzt:

<ul>
  <li>16 Bytes mit dem nonce</li>
  <li>bis zu 32 KiB mit AES-CTR und dem Dateiinhalteschlüssel verschlüsselte Daten</li>
  <li>
    32 Bytes mit dem MAC über
    <ul>
      <li>die nonce aus dem Dateikopf (um zu verhindern, dass das Stück mit Stücken in anderen Dateien vertauscht werden kann),</li>
      <li>die laufende Nummer des Stücks (um zu verhindern, dass Stücke innerhalb einer Datei vertauscht werden können),</li>
      <li>die nonce des Stücks und</li>
      <li>die verschlüsselten Daten</li>
    </ul>
  </li>
</ul>

Nach der Verschlüsselung werden diese Stücke wieder in derselben Reihenfolge zusammengefügt. Dabei kann das letzte Stück weniger als 32 KiB Daten enthalten, wenn die Datei nicht eine Länge hat, die ein Vielfaches von 32 KiB ist.

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
