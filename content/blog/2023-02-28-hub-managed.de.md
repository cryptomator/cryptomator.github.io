---
title: "Cryptomator Hub: Managed – Jetzt Zugang anfordern"
slug: hub-managed
date: 2023-02-28
tags: [cryptomator, hub]

summary: Wir freuen uns, euch mitteilen zu können, dass Managed-Instanzen von Cryptomator Hub ab sofort verfügbar sind! Außerdem haben wir Hub 1.1.0 mit Unterstützung für Wiederherstellungsschlüssel veröffentlicht.
---
Wir freuen uns, euch mitteilen zu können, dass Managed-Instanzen von [Cryptomator Hub](/de/hub/) ab sofort verfügbar sind! :tada: Außerdem haben wir Hub 1.1.0 mit Unterstützung für Wiederherstellungsschlüssel veröffentlicht.

## Zugang anfordern

Das Wichtigste zuerst. :rocket: Um loszulegen, könnt ihr jetzt [Zugang zu einer Managed-Instanz von Cryptomator Hub anfordern](/de/hub/managed/). Nach Beantragung werden wir uns so schnell wie möglich zurückmelden. Derzeit werden einige der Schritte, die wir intern durchführen, um eine Managed-Hub-Instanz zu erstellen, noch „manuell“ ausgeführt. Wir arbeiten daran, diesen Prozess zu automatisieren, aber wir wollten die Veröffentlichung nicht länger verzögern.

## Managed vs. Self-Hosted

Managed-Instanzen von Cryptomator Hub ermöglichen die sofortige Nutzung von Cryptomator Hub, ohne eine Self-Hosted-Instanz installieren und warten zu müssen.

Bisher konnte man _nur_ die Self-Hosted-Version von Cryptomator Hub verwenden. Dies erfordert eine Menge Wissen darüber, wie man einen Software-Container mittels Kubernetes oder Docker Compose installiert. Und wenn man dieses Wissen hat, muss man die Instanz immer noch selbst warten. Dazu gehört, die Software zu aktualisieren, die Instanz zu überwachen und ihre Sicherheit zu gewährleisten.

Bei Managed-Instanzen kümmern wir uns um die Installation und Wartung eurer Hub-Instanz und stellen gleichzeitig sicher, dass eure Instanz hochverfügbar ist. Ihr könnt euch auf eure Arbeit und euer Team konzentrieren.

All dies wird durch das zugrundeliegende [Zero-Knowledge Key Management](https://github.com/cryptomator/hub/wiki/Zero-Knowledge-Key-Management) ermöglicht. Cryptomator Hub speichert keine unverschlüsselten Schlüssel. Das gesamte Schlüsselmaterial bleibt lokal auf dem Client und wir können eure Daten nicht entschlüsseln. Zudem ist Hub unabhängig von eurem Cloudspeicher-Anbieter ist. Zusammengefasst: Wir haben keinen Zugriff auf das Schlüsselmaterial oder die Cloud-Dateien.

## Release 1.1.0: Wiederherstellungsschlüssel

Und es geht weiter: Wir haben Cryptomator Hub 1.1.0 mit Unterstützung für Wiederherstellungsschlüssel veröffentlicht. Damit kann man im Katastrophenfall auf seine Daten zugreifen. Und nicht nur das: Der Wiederherstellungsschlüssel ist mit dem von Cryptomator kompatibel. Das bedeutet, dass ihr eure bestehenden Tresore in Hub-Tresore umwandeln könnt und umgekehrt.

Was heißt das für eure Managed-Instanz? Wenn wir aufhören zu existieren (wir werden oft gefragt, dank Boxcryptor :wink:), könnt ihr eure Hub-Tresore in „normale“ passwortbasierte Tresore umwandeln, komplett offline, so dass ihr _immer_ und unter allen Umständen Zugriff auf eure Daten habt. Dies ist auch für eure Self-Hosted-Instanzen von Vorteil, falls eurem Server etwas zustoßen sollte.
