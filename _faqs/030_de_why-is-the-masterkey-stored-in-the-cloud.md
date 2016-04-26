---
anchor: 'masterkeyFile'
title: 'Warum ist der "Hauptschlüssel" in der Cloud gespeichert?'
language: de
published: true
abstract: 'Am Speicherort eines Tresors finden Sie eine Datei namens masterkey.cryptomator.'
---
### Was enthält diese Datei?
Die Datei enthält verschlüsselte Daten, die benötigt werden, um aus Ihrem Passwort den Hauptschlüssel abzuleiten. Sie enthält jedoch nicht den entschlüsselten Hauptschlüssel selbst.

### Ist das ein Problem für die Sicherheit?
Nein. Der verschlüsselte Schlüssel in *masterkey.cryptomator* ist nicht sensibler als die verschlüsselten Dateien selber.

Mehr Informationen finden Sie auf unserer [Sicherheitsarchitektur-Seite](/de/architecture/#masterkeyDerivation).
