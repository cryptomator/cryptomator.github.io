---
language: de
anchor: nameEncryption
title: Namen verschlüsseln
---
<p class="lead">Neben den Dateiinhalten werden auch die Dateinamen verschlüsselt.</p>

Cryptomator nutzt den Modus <a href="http://tools.ietf.org/html/rfc5297">AES-SIV</a>, um Dateien und Verzeichnisnamen zu verschlüsseln. Zusätzlich wird eine eindeutige Verzeichnis-ID des übergeordneten Verzeichnisses als Zusatzdaten übergeben. Dies verhindert das Verschieben von verschlüsselten Dateien in andere Verzeichnisse.

Der Dateiname wird technisch folgendermaßen verschlüsselt:

<pre>
cipheredName := base32(aesSiv(cleartextName, parentDirId, encryptionMasterKey, macMasterKey))
</pre>

Bei Dateien ist das ergebnis der verschlüsselte Name.

Handelt es sich hingegen um ein Verzeichnis, wird ein Unterstrich hinzugefügt. Dann wird eine Datei dieses Namens erstellt, in die wir eine eindeutige Kennzeichnung (genauer eine <abbr title="Universally unique identifier" class="initialism">UUID</abbr>) schreiben. Das dazugehörige Verzeichnis wird dann an folgendem Ort gespeichert:

<pre>
verzeichnisId := erstelleUuid()
verzeichnisIdHash := base32(sha1(aesSiv(verzeichnisId, null, encryptionMasterKey, macMasterKey)))
verzeichnisPfad := tresorWurzelverzeichnis + &apos;/d/&apos; + substr(verzeichnisIdHash, 0, 2) + &apos;/&apos; + substr(verzeichnisIdHash, 2, 30)
</pre>

Dabei steht &apos;substr(verzeichnisIdHash, 0, 2)&apos; für die ersten zwei Zeichen des verzeichnisIdHash und &apos;substr(verzeichnisIdHash, 2, 30)&apos; für die restlichen Zeichen.

Indem wir alle Verzeichnisse nebeneinander liegen, wird nicht nur die Verzeichnishierarchie verschleiert, sondern es wird auch die Pfadtiefe begrenzt, um die Kompatibilität mit einigen Cloud-Diensten sicherzustellen.
