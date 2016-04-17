---
language: de
anchor: masterkeyDerivation
title: 'Ableitung des "Masterkey"'
---
<p class="lead">Jeder Tresor hat seinen eigenen 256 Bit- und einen MAC Hauptschlüssel, die für die Verschlüsselung von dateispezifischen Schlüsseln beziehungsweise für die Dateiauthentifizierung benutzt werden.</p>

Diese Schlüssel sind zufällige Sequenzen, die durch einen <abbr title="Kryptographisch sicherer Zufallszahlengenerator (engl.: Cryptographically secure pseudorandom number generator)" class="initialism">CSPRNG</abbr> generiert werden.
Beide Schlüssel werden durch eine <a href="https://tools.ietf.org/html/rfc3394" target="_blank">RFC 3394</a> Schlüsselumhüllung mit einem <abbr title="Schlüsselverschlüsselnder Schlüssel (engl.: Key encrypting key)" class="initialism">KEK</abbr> verschlüsselt, der aus dem Passwort des Tresors durch Verwendung von Script abgeleitet wird.

<pre>
encryptionMasterKey := createRandomBytes(32)
macMasterKey := createRandomBytes(32)
kek := scrypt(password, scryptSalt, scryptCostParam, scryptBlockSize)
wrappedEncryptionMasterKey := aesKeyWrap(encryptionMasterKey, kek)
wrappedMacMasterKey := aesKeyWrap(macMasterKey, kek)
</pre>

Die umhüllten Schlüssel sowie die Parameter, die zum Erlangen des KEK nötig sind, werden dann als Zahlen oder eine Base64 Zeichenkette in einer JSON Datei namens <code>masterkey.cryptomator</code> gespeichert. Diese befindet sich im Wurzelverzeichnis des Tresors.

Beim Entsperren des Tresors wird der KEK benutzt, um die gespeicherten Hauptschlüssel zu enthüllen (d.h. entschlüsseln).

<pre>
{
  "version": 3, /* Tresorversion zum Überprüfen der Softwarekompatibilität */
  "scryptSalt": "QGk...jY=",
  "scryptCostParam": 16384,
  "scryptBlockSize": 8,
  "primaryMasterKey": "QDi...Q==", /* wrappedEncryptionMasterKey */
  "hmacMasterKey": "L83...Q==", /* wrappedMacMasterKey */
  "versionMac": "3/U...9Q=" /* HMAC-256 der Tresorversion zum Vermeiden von Downgrade-Angriffen */
}
</pre>
