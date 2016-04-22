---
language: de
anchor: headerEncryption
title: Dateikopf verschlüsseln
---
<p class="lead">Der Dateikopf enthält Metadaten, die für die Verschlüsselung des Dateiinhalts benötigt werden. Er besteht aus 88 Byte.</p>

<ul>
  <li>16 Byte sog. "nonce" die für die Verschlüsselung der Kopfdaten verwendet wird</li>
  <li>
    40 Byte mit <a href="https://en.wikipedia.org/wiki/Block_cipher_modes_of_operation#Counter_.28CTR.29">AES-CTR</a>
    verschlüsselte Kopfdaten, bestehend aus:
    <ul>
      <li>8 Byte für die Dateigröße</li>
      <li>32 Byte für den Dateischlüssel</li>
    </ul>
  </li>
  <li>32 Byte MAC der vorhergehenden 56 Bytes</li>
</ul>

Die Dateigröße wird im Dateikopf gespeichert, da die echte Dateigröße verschleiert wird. Dies wird im nächsten Abschnitt beschrieben. Zudem wird jede Datei jeweils mit einem eigenen Dateischlüssel verschlüsselt. Dieser wird ebenfalls im Dateikopf abgelegt.

Technisch werden diese Daten wie folgt erzeugt:

<pre>
nonce := erzeugeZufälligeBytes(16)
dateischlüssel := erzeugeZufälligeBytes(32)
kopfdaten := bigEndian(dateigröße) . dateischlüssel
verschlüsselteKopfdaten := aesCtr(kopfdaten, hauptschlüssel, nonce)
mac := hmacSha256(nonce . verschlüsselteKopfdaten, macHauptschlüssel)
</pre>
