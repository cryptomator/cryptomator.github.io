---
language: de
anchor: nameEncryption
title: Namen verschlüsseln
---
<p class="lead">Bevor wir uns mit den eigentlichen Dateiinhalten beschäftigen, werden die Dateinamen verschlüsselt.</p>

Cryptomator nutzt AES-SIV, um Dateien und Verzeichnisnamen zu verschlüsseln. Zusätzlich wird eine eindeutige Verzeichnis-ID des übergeordneten Verzeichnisses als Zusatzdaten übergeben.

<pre>
cipheredName := base32(aesSiv(cleartextName, parentDirId, encryptionMasterKey, macMasterKey))
</pre>

Falls es sich um einen Dateinamen handelt, sind wir hier fertig.

Handelt es sich hingegen um einen Verzeichnisnamen, wird ein Unterstrich hinzugefügt. Dann erstellen wir eine Datei dieses Namens, in die wir eine eindeutige Kennzeichnung (genauer eine <abbr title="Universally unique identifier" class="initialism">UUID</abbr>) schreiben. Das dazugehörige Verzeichnis ist jedoch an einem anderen Ort gespeichert:

<pre>
verzeichnisId := erstelleUuid()
verzeichnisIdHash := base32(sha1(aesSiv(verzeichnisId, null, encryptionMasterKey, macMasterKey)))
verzeichnisPfad := tresorWurzelverzeichnis + &apos;/d/&apos; + substr(verzeichnisIdHash, 0, 2) + &apos;/&apos; + substr(verzeichnisIdHash, 2, 30)
</pre>

Indem wir alle Verzeichnisse nebeneinander legen, verschleiern wir nicht nur die Verzeichnishierarchie, sondern begrenzen auch die Pfadtiefe unabhängig von der eigentlichen Hierarchie, um die Kompatibilität mit einigen Cloud Services sicherzustellen.
