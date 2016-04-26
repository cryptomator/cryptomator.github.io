---
language: de
anchor: nameShortening
title: Kürzung der Pfade
---
<p class="lead">Dieser Schritt ändert die Dateiinhalte nicht. Der einzige Zweck ist es, die Kompatibilität mit einigen Microsoft-Produkten sicherzustellen, die noch immer keine langen Pfade unterstützen.</p>

Trotz der flachen Ordnerhierarchien, die durch die [Dateinamensverschlüsselung erzeugt wurde](#nameEncryption), kann der Pfad zu einer Datei länger als 255 Zeichen sein. Immer wenn ein Dateiname einen Grenzwert überschreitet, wird dieser durch einen wesentlich kürzeren SHA-1-Hash ersetzt und bekommt eine `.lng`-Erweiterung. Zusätzlich wird eine Datei gleichen Namens im Verzeichnis `m` erstellt, die die Zuordnung des ursprünglichen Namens erlaubt.

Durch diesen Schritt wird keine zusätzliche Sicherheit erreicht, sondern lediglich die Kompatibilität maximiert.
