---
language: de
anchor: masterkeyDerivation
title: Ableitung des Hauptschlüssels
---
<p class="lead">Jeder Tresor hat seinen eigenen 256 Bit- sowie einen MAC-Hauptschlüssel, die für die Verschlüsselung von dateispezifischen Schlüsseln beziehungsweise für die Dateiauthentifizierung benutzt werden.</p>

Diese Schlüssel sind zufällige Sequenzen, die durch einen kryptographisch sicheren Zufallszahlengenerator (CSPRNG) generiert werden.

Aus dem Passwort des Tresors wird durch Verwendung von <a href="https://de.wikipedia.org/wiki/Scrypt" target="_blank">scrypt</a> ein <abbr title="Key-encryption key" class="initialism">KEK</abbr> abgeleitet wird. Beide Hauptschlüssel werden durch <a href="https://tools.ietf.org/html/rfc3394" target="_blank">Key Wrapping</a> mit diesem KEK verschlüsselt.

<pre>
encryptionMasterKey := createRandomBytes(32)
macMasterKey := createRandomBytes(32)
kek := scrypt(password, scryptSalt, scryptCostParam, scryptBlockSize)
wrappedEncryptionMasterKey := aesKeyWrap(encryptionMasterKey, kek)
wrappedMacMasterKey := aesKeyWrap(macMasterKey, kek)
</pre>

Die umhüllten Schlüssel sowie die Parameter, die zum Erlangen des KEK nötig sind, werden dann in einer JSON-Datei namens `masterkey.cryptomator` gespeichert. Diese befindet sich im Wurzelverzeichnis des Tresors und sieht in etwa so aus:

<pre>
{
  "version": 3, /* vault version for checking software compatibility */
  "scryptSalt": "QGk...jY=",
  "scryptCostParam": 16384,
  "scryptBlockSize": 8,
  "primaryMasterKey": "QDi...Q==", /* wrappedEncryptionMasterKey */
  "hmacMasterKey": "L83...Q==", /* wrappedMacMasterKey */
  "versionMac": "3/U...9Q=" /* HMAC-256 of vault version to prevent downgrade attacks */
}
</pre>

Beim Entsperren des Tresors wird der KEK, der aus dem Passwort und den Parametern in der Datei `masterkey.cryptomator` ermittelt wird, benutzt, um die gespeicherten Hauptschlüssel zu enthüllen (d.h. zu entschlüsseln). Erst mit den enthüllten Hauptschlüsseln ist die Entschlüsselung der Daten möglich.
