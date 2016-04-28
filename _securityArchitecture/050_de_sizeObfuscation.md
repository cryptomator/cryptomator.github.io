---
language: de
anchor: sizeObfuscation
title: Verschleierung der Dateigröße
---
<p class="lead">Um es zu erschweren, eine Datei anhand einer bekannten Größe zu identifizieren, wird die Datei vor der Verschlüsselung um ein zufälliges Padding verlängert.</p>

Die Datei sollte daduch nicht immens groß werden, daher wird die maximale Länge dieser Zufallsdaten aus der Größe der Datei errechnet.

<pre>
upperBound := max(min(10% * realFileSize, 16MiB), 4KiB)
paddingLength := randomInt(upperBound)
</pre>

Somit wird eine Datei um bis zu 10% verlängert, aber mindestens um 0-4 KiB und nie um mehr als 16 MiB.

Der Inhalt der Dateiverlängerung ist nicht definiert, da – wie zuvor beschrieben – die echte Länge der Datei im Dateikopf gespeichert wird und ausreicht, um das echte Dateiende zu ermitteln.
