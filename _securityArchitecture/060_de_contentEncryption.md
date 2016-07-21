---
language: de
anchor: contentEncryption
title: Verschlüsselung des Dateiinhalts
---
<p class="lead">Hier wird der aktuelle Dateiinhalt verschlüsselt.</p>

Der unverschlüsselte Dateiinhalt wird in mehrere Stücke zerteilt, jedes bestehend aus 32 KiB. Diese Stücke werden dann jeweils verschlüsselt und folgendermaßen um weitere 48 Bytes ergänzt:

- 16 Bytes mit dem nonce
- bis zu 32 KiB mit AES-CTR und dem Dateiinhalteschlüssel verschlüsselte Daten
- 32 Bytes mit dem MAC über
  - die nonce aus dem Dateikopf (um zu verhindern, dass das Stück unerkannt mit Stücken in anderen Dateien vertauscht wird),
  - die laufende Nummer des Stücks (um zu verhindern, dass Stücke unerkannt innerhalb einer Datei vertauscht werden können),
  - die nonce des Stücks und
  - die verschlüsselten Daten

Nach der Verschlüsselung werden diese Stücke wieder in derselben Reihenfolge zusammengefügt. Dabei kann das letzte Stück weniger als 32 KiB Daten enthalten, wenn die Datei nicht eine Länge hat, die ein Vielfaches von 32 KiB ist.

<pre>
cleartextChunks[] := split(paddedCleartext, 32KiB)
for (int i = 0; i < length(cleartextChunks); i++) {
  chunkNonce := createRandomBytes(16)
  ciphertextPayload := aesCtr(cleartextChunks[i], contentKey, chunkNonce)
  mac := hmacSha256(headerNonce . bigEndian(i) . chunkNonce . ciphertextPayload, macMasterKey)
  ciphertextChunks[i] := chunkNonce . ciphertextPayload . mac
}
ciphertextFileContent := join(ciphertextChunks[])
</pre>

<img src="/img/architecture/file-content-encryption.png" srcset="/img/architecture/file-content-encryption.png 1x, /img/architecture/file-content-encryption@2x.png 2x" alt="Verschlüsselung des Dateiinhalts" />
<figcaption>* Zufällig bei jeder Stückänderung</figcaption>
