---
title: "Zwei Betas: Document Provider für Android und FSKit für Mac"
slug: beta-document-provider-fskit
date: 2026-10-30
tags: [cryptomator, android, desktop, macos, beta]

summary: "Zwei neue Betas sind bereit zum Testen. Unter Android bringt der lang ersehnte Document Provider deine Tresore direkt in die Dateien-App. Auf dem Mac kannst du entsperrte Tresore dank FSKit als Laufwerk anzeigen, ohne zusätzlich etwas zu installieren. Mach bei den Betas mit und hilf uns, beide fit für das Release zu machen!"

ogimage:
  relsrc: /img/blog/beta-document-provider-fskit.png
  width: 1200
  height: 675
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/beta-document-provider-fskit.png" alt="Cryptomator-Betas: Document Provider für Android und FSKit für Mac" />
</figure>

Es gibt nicht eine, sondern gleich zwei neue Betas. Die eine bringt ein Feature, das sich viele gewünscht haben. Die andere macht Cryptomator auf dem Mac deutlich einfacher. Bevor beide in stabilen Releases landen, kannst du sie schon jetzt testen und uns Feedback geben.

## Android: Der Document Provider ist endlich da

Der Document Provider ist das **meistgewünschte Feature** unserer Android-App. Viele haben auf GitHub, im Forum und in App-Bewertungen danach gefragt. **Jetzt ist er endlich da!**

Bisher brauchte es mehrere Schritte, um eine Datei aus deinem Tresor in einer anderen App zu öffnen. Du musstest Cryptomator öffnen, den Tresor entsperren, zur Datei navigieren und sie antippen, um sie in der anderen App zu öffnen.

Mit dem Document Provider erscheinen deine Tresore **direkt in der Android-Dateien-App und in der Dateiauswahl des Systems**. Jede App, die das unterstützt, kann Dateien in deinem Tresor öffnen, speichern, erstellen, umbenennen, verschieben und löschen, ganz ohne Umweg über Cryptomator. Und natürlich bleibt dabei alles durch **clientseitige Verschlüsselung** geschützt. Deine Dateien werden auf deinem Gerät verschlüsselt, **bevor** sie in der Cloud landen, genau wie bisher.

### 📂 Deine Tresore in der Dateien-App

Jeder Tresor bekommt einen eigenen Eintrag in der Dateien-App. Ist ein Tresor gesperrt, tippst du ihn einfach an und entsperrst ihn direkt dort. Bilder bekommen Vorschaubilder, sodass du das eine Foto findest, ohne jede einzelne Datei öffnen zu müssen.

Du möchtest deine Tresore dort nicht sehen? Dann deaktiviere in den Einstellungen **„Tresore in der Dateien-App anzeigen“**.

### 💾 Speichern und weitermachen

Wenn du eine Datei aus einer anderen App speicherst, lädt Cryptomator sie im Hintergrund hoch. Wurde die Datei in der Zwischenzeit in der Cloud geändert, wird nichts überschrieben. Cryptomator speichert deine Version stattdessen als separate **Konfliktkopie**.

### 🔒 Schlaueres automatisches Sperren

„Sperren nach“ zählt jetzt ab der letzten Nutzung des Tresors, inklusive Zugriffen aus anderen Apps. So wird dein Tresor nicht gesperrt, während du noch woanders an einem Dokument arbeitest. Die neue Einstellung **„Auf Übertragungen warten“** (standardmäßig aktiviert) hält deinen Tresor außerdem entsperrt, bis laufende Uploads abgeschlossen sind. „Alle sperren“ sperrt weiterhin sofort alles.

### ⚡ Ein schnellerer Datei-Browser in der App

Keine Sorge, der Datei-Browser in der App bleibt. Du kannst deine Tresore weiterhin direkt in Cryptomator durchsuchen und verwalten. Er nutzt jetzt denselben Cache wie die Dateien-App, sodass beide immer denselben Stand zeigen. Änderungen erscheinen sofort, und der Upload-Fortschritt wird direkt an jeder Datei angezeigt. Lehnt die Cloud eine Änderung ab, gibt Cryptomator dir Bescheid und macht sie rückgängig.

### Gut zu wissen

Da es sich um eine Beta handelt, gibt es ein paar Dinge zu beachten:

- **Das erste Öffnen einer Datei kann einen Moment dauern.** Dateien, die noch nicht im Cache liegen, müssen erst heruntergeladen werden.
- **Fehlgeschlagene Uploads werden nicht automatisch wiederholt.** Zieh in der Dateien-App zum Aktualisieren nach unten oder tippe in Cryptomator auf die Datei, um es erneut zu versuchen.
- **Ein neuer Cache.** Ordnerinhalte und geöffnete Dateien werden jetzt lokal im privaten App-Speicher von Cryptomator zwischengespeichert und bleiben auch nach dem Sperren des Tresors verfügbar. Du kannst den Cache jederzeit in den Einstellungen leeren. Die bisherigen Cache-Einstellungen entfallen.

### So machst du bei der Beta mit

Wie du mitmachst, hängt davon ab, woher du Cryptomator hast.

**Du hast Cryptomator aus Google Play?** [Öffne diesen Link](https://play.google.com/apps/testing/org.cryptomator.freemium) und tippe auf **„Tester werden“**. Wenn du im Play Store die Vollversion ohne In-App-Käufe gekauft hast, nimm stattdessen [diesen Link](https://play.google.com/apps/testing/org.cryptomator).

Das war's! Die Beta kommt dann wie jedes andere Update über den Play Store.

**Du hast Cryptomator von unserer Website oder aus F-Droid?** Öffne die Download-Seite unten und wähle die Datei, die dazu passt, woher du die App hast:

- Unsere Website: `Cryptomator-3.0.0-beta1_signed.apk`
- Unser F-Droid-Repository: `Cryptomator-3.0.0-beta1_fdroid_signed.apk`
- Das Haupt-Repository von F-Droid: `Cryptomator-3.0.0-beta1_lite_signed.apk`

<div class="text-center">
  <a href="https://github.com/cryptomator/android/releases/tag/3.0.0-beta1"><i class="fa-solid fa-download"></i> Android-Beta herunterladen</a>
</div>

## Mac: Tresore als Laufwerk mit FSKit (experimentell)

Wenn du Cryptomator auf dem Mac nutzt, kennst du das vermutlich. Um einen entsperrten Tresor als Laufwerk anzuzeigen, musstest du bisher erst **macFUSE oder FUSE-T** installieren. Das hieß ein zweiter Download, eine Kernel-Erweiterung erlauben und auf Apple Silicon sogar ein Ausflug in den Wiederherstellungsmodus, um Sicherheitseinstellungen zu ändern, gefolgt von einem Neustart. „Wofür brauche ich das?“ ist eine der häufigsten Fragen an unseren Support und auch sehr berechtigt.

Und die Einrichtung war erst der Anfang. Viele haben uns von einfrierenden Finder-Fenstern erzählt, von Tresoren, die sich nicht sperren lassen, und von Laufwerken, die nach einem großen macOS-Update nicht mehr funktionieren, bis ein reparierter Treiber erscheint.

Mit der neuen Beta führen wir eine Alternative ein, die auf **FSKit** basiert, Apples eigenem Framework für Dateisysteme. Es läuft als App-Erweiterung direkt in Cryptomator. Du brauchst also **weder macFUSE noch FUSE-T und auch keine separate FSKit-Erweiterung**.

### Was FSKit verbessert

- 📦 **Nichts zusätzlich installieren.** Kein zweiter Download, keine Kernel-Erweiterung, kein Wiederherstellungsmodus, kein Neustart.
- 🍏 **Basiert auf Apples eigener Technologie.** Cryptomator ist nicht mehr auf einen Treiber eines Drittanbieters angewiesen, du musst also nach einem macOS-Release nicht auf das Update einer anderen Firma warten.
- 💽 **Fühlt sich an wie ein normales Laufwerk.** Tresore können direkt unter `/Volumes` eingebunden werden und behalten im Finder ihren Namen.
- ⚡ **Schneller bei großen Dateien.** In unseren Tests wurden große Dateien schneller gelesen als mit macFUSE.

### Voraussetzungen und Einschränkungen

Die FSKit-Unterstützung ist **experimentell und optional**. Wir wollen offen damit umgehen, was das bedeutet:

- **macOS 27 oder neuer auf Apple Silicon ist Voraussetzung.** Intel-Macs werden nicht unterstützt.
- **Du schaltest es selbst ein.** Wähle in den Einstellungen von Cryptomator FSKit als Laufwerkstyp. macOS bittet dich dann einmalig, die Erweiterung in den Systemeinstellungen zu aktivieren.
- **Viele kleine Dateien sind langsamer.** Wenn du mit Tausenden winziger Dateien arbeitest, ist FSKit aktuell spürbar langsamer als macFUSE.
- **Finder-Tags und andere erweiterte Attribute bleiben nicht erhalten**, und Hardlinks werden nicht unterstützt.

Wenn davon etwas ein Ausschlusskriterium ist, kannst du einfach weiterhin macFUSE oder FUSE-T nutzen.

### So machst du bei der Beta mit

FSKit auszuprobieren geht in nur drei Schritten:

1. **Lade Cryptomator 1.20.0-beta1** über den Link unten herunter.
2. **Installiere es** wie gewohnt.
3. **Schalte FSKit ein**, indem du es in den Einstellungen von Cryptomator als Laufwerkstyp auswählst.

<div class="text-center">
  <a href="https://github.com/cryptomator/cryptomator/releases/tag/1.20.0-beta1"><i class="fa-solid fa-download"></i> Mac-Beta herunterladen</a>
</div>

## Wir brauchen dein Feedback!

Wie bei jeder Beta gilt: Bitte leg vor dem Testen ein Backup deiner wichtigen Daten an. Dann nutze beide Betas in deinem Alltag und sag uns, was funktioniert und was nicht. Unter Android probierst du am besten deine Lieblings-Apps aus, egal ob Notizen, Office, PDF-Reader oder Bildbearbeitung. Auf dem Mac nutzt du deine Tresore im Finder einfach so wie immer.

Melde Bugs auf GitHub für [Android](https://github.com/cryptomator/android/issues) oder [Desktop](https://github.com/cryptomator/cryptomator/issues) oder teile deine Erfahrungen in unserem [Community-Forum](https://community.cryptomator.org/). Du willst uns einfach sagen, was du davon hältst? Du findest uns auch auf [Mastodon](https://mastodon.online/@cryptomator) und [LinkedIn](https://www.linkedin.com/company/skymatic/).

Du hast lange auf den Document Provider gewartet? Danke für deine Geduld. 💚
