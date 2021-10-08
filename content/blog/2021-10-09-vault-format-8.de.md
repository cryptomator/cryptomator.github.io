---
title: "Vault Format 8"
slug: vault-format-8
date: 2021-10-09
tags: [cryptomator, vault-format]

summary: "im Zuge des anstehenden Releases von Cryptomator 1.6.0 möchten wir euch einen Einblick über die Motivation und Umsetzung eine der wichtigen Änderungen geben: Das neue Tresorformat in Version 8."
---

Hallo Community!
im Zuge des anstehenden Releases von Cryptomator 1.6.0 möchten wir euch einen Einblick über die Motivation und Umsetzung eine der wichtigen Änderungen geben: Das neue Tresorformat in Version 8.

Ja, ein neues Tresorformat.
Diejenigen, die sich an das letzte Upgrade erinnern, werden vielleicht etwas schlucken, denn beim letzten Mal war der Migrationsprozess von Tresorformat 6 zu 7 in einigen Fällen nicht ohne Hindernisse und Probleme zu bewältigen. 
Aber keine Sorge, dieses Mal sind die Änderungen minimal invasiv!

Dieser Artikel wird die Motivation für die Gestaltung des neuen Formats dargelegen, die Änderungen erläutern und skizziert, wie der Migrationsprozess abläuft. 

## Die Motivation
Der Speicherort des Masterkey eines Tresors ist ein Thema, das schon in den Anfangstagen von Cryptomator viele Fragen aufgeworfen und zu mehreren Feature Requests geführt hat. (vergleiche die Klickzahlen im Forumsartikel ["Why is the masterkey stored in the cloud"](https://community.cryptomator.org/t/why-is-the-masterkey-stored-in-the-cloud/))
Woher kommt das?
Der Masterkey eines Tresors wird innerhalb der Tresor-Ordnerstruktur in einer Datei namens `masterkey.cryptomator` gespeichert und mit nach heutigem Kenntnisstand modernen und sicheren Algorithmen verschlüsselt.
Sein Speicherort stellt kein Sicherheitsrisiko dar und gewährleistet zudem, dass dieser integrale Bestandteil eines Tresors immer mit dem Tresor verschoben wird.
Zugegeben, über den Namen der Datei lässt sich streiten, aber es ist eindeutig, dass die Datei wichtig ist.

Doch hier geht es nicht um den Namen.
Wenn man festlegt, wo der Hauptschlüssel gespeichert wird, verliert man die Flexibilität, ihn von einem anderen Ort zu laden. (Ein entsprechender [Feature Request](https://github.com/cryptomator/cryptomator/issues/96) ist unter den ersten 100 Tickets von Cryptomator!)
Was ist, wenn ein Benutzer einen Hardware-Token hat, der ihn speichern könnte?
Oder was ist, wenn ein Unternehmen eine zentralisierte Schlüsselverwaltung mit [Single Sign-On] (https://en.wikipedia.org/wiki/Single_sign-on) hat und diese mit Cryptomator nutzen möchte?
Und selbst wenn Lösungen für die oben genannten Fragen gefunden werden, wie passt man diese an, wenn sich die Struktur/das Format des Tresors ändert?

Diese Fragen führten zu der Idee, das Laden des Masterkeys von der Tresorstruktur zu entkoppeln, und schließlich zum Entwurf des Tresorformats 8.

## Die Änderungen
Mit Tresorformat 8 führen wir eine neue Datei namens `vault.cryptomator` für jeden Tresor ein, die sich im Stammverzeichnis des Tresors befindet.
Dies ist die neue, zentrale Konfigurationsdatei des Tresors.
Zusammen mit dem Datenverzeichnis namens "d" bilden sie das erforderliche Minimum für einen gültigen Tresor.

Die Tresorkonfigurationsdatei ist ein [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token), welche die grundlegenden Informationen über den Tresor (wie einen eindeutige Id) und insbesondere den Ort enthält, woher der Hauptschlüssel geladen werden soll.
Alle anderen Parameter, die für das Laden des Masterkeys erforderlich sind, werden nicht mehr in der Tresorkonfiguration gespeichert, was zur gewünschten Entkopplung des Masterkeys von Tresorformat zur Folge hat und die Möglichkeit eröffnet, den Masterkey aus anderen Quellen als nur der Datei "masterkey.cryptomator" im Tresor zu beziehen.
In zukünftigen Versionen kann beispielsweise der Masterkey aus einem [Yubikey](https://www.yubico.com) oder dem Microsoft Certification Store geladen werden.
Da es sich bei der Tresorkonfiguration um ein JWT handelt, kann durch Signieren der Datei mit dem Masterkey sichergestellt werden, dass diese nicht manipuliert wurde.

Wie bereits erwähnt, kann die Tresorkonfigurationsdatei auch zusätzliche Informationen speichern.
Eine davon ist die tresorspezifische Schwelle für die Verkürzung von _verschlüsselten_ Dateinamen.
Vor Format 8 war dieser Wert im Verschlüsselungsschema von Cryptomator fest verankert.
Durch die Angabe in der Tresorkonfiguration kann sie in Zukunft konfiguriert werden, so dass die vollen Funktionen eines Tresors auch an restriktiveren Speicherorten verfügbar sind.

Das Verschlüsselungsschema, die Verzeichnisstruktur und die verschlüsselten Dateien bleiben unverändert.

## Die Migration

Was bedeuten diese Änderungen für eine Migration von Tresorformat 7 auf 8?
So gut wie nichts!

Die einzige Datei, die bearbeitet wird, ist `masterkey.cryptomator`.
Für alle "Nur-Online"-Nutzer wäre es daher ausreichend, nur diese Datei herunterzuladen.

Im eigentlichen Migrationsprozess wird zuerst die Tresorkonfigurationsdatei `vault.cryptomator` erstellt und mit den korrekten Werten wie dem bereits erwähnten eindeutigen Tresorkennzeichen gefüllt.
Zweitens wird die bereits vorhandene Masterkey-Datei aktualisiert.
Und drittens... das war's auch schon :smile: Keine anderen Dateien müssen geändert werden!

Wie Ihr seht, bringt das Tresorformat 8 nur eine kleine und leicht zu bewerkstelligende Änderung mit sich und macht gleichzeitig Platz für interessante und spannende neue Funktionen. 
Mit dem Update auf Cryptomator 1.6.0, werden neu erstelle Tresore das Format 8 direkt besitzten, Tresore einer früheren Version müssen migriert werden.
Beachtet, dass die Masterkey-Datei weiterhin benötigt wird, da sie den eigentlichen Schlüssel zu eurem Tresor enthält. 

Wir hoffen, dass Ihr nach dem Lesen des Artikels ohne Sorge auf ein Tresor-Upgrade blickt!
Wenn Ihr mehr über die kommende Version 1.6.0 von Cryptomator erfahren wollt, lest [Cryptomator 1.6.0: Was hat sich geändert?](https://cryptomator.org/blog/2021/10/09/1-6-0-what-you-need-to-know/).
