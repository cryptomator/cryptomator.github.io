---
language: de
anchor: contentEncryption
title: Inhalt verschlüsseln
---
<p class="lead">Hier wird der aktuelle Dateiinhalt verschlüsselt.</p>

Der unverschlüsselte Dateiinhalt wird in mehrere Stücke zerteilt, jede bestehend aus 32 KiB.

Diese Stücke werden dann jeweils verschlüsselt und folgendermaßen um weitere 48 Byte ergänzt:

<ul>
  <li>16 Byte "nonce"</li>
  <li>bis zu 32 KiB mit AES-CTR und dem Dateischlüssel verschlüsselte Daten</li>
  <li>
    32 Byte MAC über
    <ul>
      <li>die nonce aus dem Dateikopf (um zu verhindern, dass das Stück mit Stücken in anderen Dateien vertauscht werden kann),</li>
      <li>die laufende Nummer des Stücks (um zu verhindern, dass Stücke innerhalb einer Datei vertauscht werden können),</li>
      <li>die nonce des Stücks und</li>
      <li>die verschlüsselten Daten,</li>
    </ul>
  </li>
</ul>

Nach der Verschlüsselung werden diese Stücke wieder in der selben Reihenfolge zusammengefügt. Dabei kann das letzte Stück weniger als 32 KiB Daten enthalten wenn die Datei nicht eine Länge hat, die ein vielfaches von 32 KiB ist.

Der technische Ablauf ist folgender:

<pre>
unverschlüsselteStücke[] := zerstückeln(verlängerterUnverschlüsselterDateiinhalt, 32KiB)
für (stückNummer von 0 bis länge(unverschlüsselteStücke)-1) {
  stückNonce := erzeugeZufälligeBytes(16)
  verschlüsselteDaten := aesCtr(unverschlüsselteStücke[i], dateischlüssel, stückNonce)
  mac := hmacSha256(dateikopfNonce . bigEndian(i) . stückNonce . verschlüsselteDaten, macHauptschlüssel)
  verschlüsselteStücke[i] := stückNonce . verschlüsselteDaten . mac
}
verschlüsselterDateiinhalt := zusammenfügen(verschlüsselteStücke[])
</pre>
