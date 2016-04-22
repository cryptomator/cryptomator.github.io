---
language: de
anchor: nameShortening
title: Kürzung der Pfade
---
<p class="lead">Dieser Schritt ändert die Dateinhalte nicht. Der einzige Zweck ist es, die Kompatibilität mit einigen Microsoft Produkten sicherzustellen, die noch immer keine langen Pfade unterstützen.</p>

Trotz der flachen Ordnerhierarchien die durch die <a href="#nameEncryption">Dateinamensverschlüsselung erzeugt wurde</a>, kann der Pfad zu einer Datei länger als 255 Zeichen sein. Immer wenn ein Dateiname einen Grenzwert überschreitet, wird dieser durch einen wesentlich kürzeren SHA-1 hash ersetzt und bekommt eine <code>.lng</code> erweiterung. Zusätzlich wird eine Datei gleichen Names im Verzeichnis <code>m</code> erstellt die die Zuordnung des ursprünglichen Namens erlaubt.

Durch diesen Schritt wird keine zusätzliche Sicherheit erreicht sondern lediglich die Kompatibilität maximiert.
