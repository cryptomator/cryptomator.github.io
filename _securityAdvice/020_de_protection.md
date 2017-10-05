---
language: de
anchor: protection
title: Sicherheitsziel
---
<p class="lead">Cryptomator wurde entworfen, um Probleme mit der Privatsphäre beim Speichern von Dateien über Cloudspeicher zu lösen.</p>

Die Verschlüsselung erschwert den Zugriff auf die in der Cloud gespeicherten Daten durch den Cloudspeicher-Anbieter selbst oder unberechtigte Dritte. Nur jemand mit der Kenntnis des Tresor-Passworts ist in der Lage, die Dateien im Tresor zu lesen oder die Dateiinhalte unbemerkt zu verändern. Dies gilt für die Dateiinhalte sowie die Dateinamen.

Damit die Synchronisation mit der Cloud effizient funktioniert, gibt es jedoch einige Metainformationen, die Cryptomator nicht verschlüsselt. Diese sind:

- die Zugriffs-, Änderungs-, und Erstellungszeitpunkte der Dateien und Ordner,
- die Anzahl der Dateien und Ordner im Tresor und in den einzelnen Ordnern und
- die Größen der gespeicherten Dateien.

Außerdem gilt es zu beachten, was Cryptomator nicht bietet. Der Schutz der Dateien auf dem lokalen Gerät ist nicht der Fokus von Cryptomator. Cryptomator ist kein vollständiger Ersatz für andere Verschlüsselungstools, die auf Containerdateien basieren, wenn neben Dateiinhalten und -namen auch die oben genannten Metainformationen verschlüsselt werden sollen. Außerdem bietet Cryptomator keinen vollständigen Schutz für den Fall, dass Anwendungen bei der Nutzung Sicherheitskopien der bearbeiteten Dateien außerhalb des Tresors ablegen. Diese werden von Cryptomator nicht erkannt und verbleiben somit ggf. auch nach dem Sperren von Tresoren auf dem Computer. Auch schützt Cryptomator nicht, wenn der lokale Computer durch Schadsoftware infiziert ist, die Passwörter oder Dateien (z.B. die Dateien in einem entsperrten Tresor) mitliest.

Um sich vor solchen Risiken zu schützen, sind andere Methoden, wie z.B. die vollständige Festplattenverschlüsselung, umgehende Installation von System- und Software-Updates und die Verwendung geeigneter Antivirensoftware notwendig.
