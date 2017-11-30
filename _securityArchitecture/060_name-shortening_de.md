---
language: de
anchor: nameShortening
title: Kürzung der Pfade
---
<p class="lead">Dieser Schritt ändert die Dateiinhalte nicht. Der einzige Zweck ist es, die Kompatibilität mit einigen Microsoft-Produkten sicherzustellen, die noch immer keine langen Pfade unterstützen.</p>

Trotz der flachen Ordnerhierarchie, die durch die [Dateinamensverschlüsselung erzeugt wird](#nameEncryption), kann der Pfad zu einer Datei länger als 255 Zeichen sein. Wenn ein verschlüsselter Dateiname die Länge von 129 Zeichen überschreitet, wird dieser durch einen wesentlich kürzeren SHA-1-Hash ersetzt und bekommt eine <code>.lng</code>-Erweiterung. Zusätzlich wird eine Datei gleichen Namens im Verzeichnis <code>m</code> erstellt, die die Zuordnung des ursprünglichen Namens erlaubt.

<pre>
if (length(ciphertextName) <= 129) {
  deflatedName := ciphertextName
} else {
  deflatedName := base32(sha1(ciphertextName)) + '.lng'
  metadataPath := vaultRoot + '/m/' + substr(deflatedName, 0, 2) + '/' + substr(deflatedName, 2, 2)
  metadataContent := ciphertextName
}
</pre>

Durch diesen Schritt wird keine zusätzliche Sicherheit erreicht, sondern lediglich die Kompatibilität maximiert.
