---
title: "Der Document Provider für Android ist da"
slug: android-document-provider-release
date: 2026-11-19
tags: [cryptomator, android, release]

summary: "Verschlüsselte Dateien direkt in jeder App öffnen und speichern: Mit Cryptomator für Android 3.0.0 ist das meistgewünschte Feature unserer Android-App da."

ogimage:
  relsrc: /img/blog/android-document-provider-release.png
  width: 1200
  height: 675
---

Verschlüsselte Dateien direkt in jeder App öffnen und speichern: Mit **Cryptomator für Android 3.0.0** ist das **meistgewünschte Feature** unserer Android-App da.

<video class="rounded-sm" controls preload="none" poster="/img/blog/android-document-provider-video-thumbnail.png">
  <source src="https://static.cryptomator.org/blog/android-document-provider-release.mp4" type="video/mp4">
  Dieser Browser unterstützt keine Videos.
</video>

## Was der Document Provider macht

Bisher brauchte es mehrere Schritte, um eine Datei aus einem Tresor in einer anderen App zu öffnen: Cryptomator öffnen, den Tresor entsperren, zur Datei navigieren und sie antippen, um sie an die andere App zu übergeben.

Jetzt erscheinen Tresore **direkt in der Android-Dateien-App und in der Dateiauswahl des Systems**. Jede App, die das unterstützt, kann Dateien im Tresor öffnen, speichern, erstellen, umbenennen, verschieben und löschen. Notiz-Apps, Office-Apps, PDF-Reader oder Bildbearbeitung arbeiten mit verschlüsselten Dateien wie mit jeder anderen Datei.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-open-in-app.png" srcset="/img/blog/android-document-provider-open-in-app.png 1x, /img/blog/android-document-provider-open-in-app@2x.png 2x" alt="Eine Tabelle aus einem Cryptomator-Tresor in einer Office-App öffnen" />
</figure>

Und natürlich bleibt dabei alles durch **clientseitige Verschlüsselung** geschützt. Dateien werden auf dem Gerät verschlüsselt, **bevor** sie in der Cloud landen, egal ob bei Dropbox, Google Drive, OneDrive oder einem anderen Anbieter.

### 📂 Tresore in der Dateien-App

Jeder Tresor bekommt einen eigenen Eintrag in der Dateien-App. Ein gesperrter Tresor lässt sich mit einem Tippen direkt dort entsperren. Bilder bekommen Vorschaubilder, sodass sich das gesuchte Foto findet, ohne jede einzelne Datei öffnen zu müssen.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-unlock.png" srcset="/img/blog/android-document-provider-unlock.png 1x, /img/blog/android-document-provider-unlock@2x.png 2x" alt="Cryptomator-Tresore in der Android-Dateien-App, entsperrt per biometrischer Anmeldung" />
</figure>

Wer die Tresore dort nicht sehen möchte, deaktiviert in den Einstellungen **„Tresore in der Dateien-App anzeigen“**.

### 💾 Speichern und weitermachen

Wird eine Datei aus einer anderen App gespeichert, lädt Cryptomator sie im Hintergrund hoch. Wurde die Datei in der Zwischenzeit in der Cloud geändert, wird nichts überschrieben. Cryptomator speichert die lokale Version stattdessen als separate **Konfliktkopie**.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-save.png" srcset="/img/blog/android-document-provider-save.png 1x, /img/blog/android-document-provider-save@2x.png 2x" alt="Eine bearbeitete Tabelle zurück in einen Cryptomator-Tresor speichern" />
</figure>

### 🔒 Schlaueres automatisches Sperren

„Sperren nach“ zählt jetzt ab der letzten Nutzung des Tresors, inklusive Zugriffen aus anderen Apps. So wird ein Tresor nicht gesperrt, während in einer anderen App noch an einem Dokument gearbeitet wird. Die neue Einstellung **„Auf Übertragungen warten“** (standardmäßig aktiviert) hält den Tresor außerdem entsperrt, bis laufende Uploads abgeschlossen sind. „Alle sperren“ sperrt weiterhin sofort alles.

### ⚡ Ein schnellerer Datei-Browser in der App

Der Datei-Browser in der App bleibt. Tresore lassen sich weiterhin direkt in Cryptomator durchsuchen und verwalten. Der Browser nutzt jetzt denselben Cache wie die Dateien-App, sodass beide immer denselben Stand zeigen. Änderungen erscheinen sofort, und der Upload-Fortschritt wird direkt an jeder Datei angezeigt. Außerdem zeigt auch der Browser in der App jetzt Vorschaubilder an.

## Hol dir das Update

Cryptomator für Android 3.0.0 wird ab sofort über Google Play verteilt und ist auch über unsere Website und F-Droid erhältlich. Wie gewohnt ist das Update kostenlos. Wer Cryptomator schon nutzt, muss nur die App aktualisieren. Neu bei Cryptomator? Die App gibt es [kostenlos zum Herunterladen](/de/android/) und Ausprobieren. Auch in der kostenlosen Version ist der Document Provider dabei, dort wie schon der Datei-Browser in der App nur lesend.

Wir sind gespannt, in welchen Apps und Workflows Cryptomator-Tresore jetzt zum Einsatz kommen. Erfahrungen lassen sich am besten in unserem [Community-Forum](https://community.cryptomator.org/) oder auf [Mastodon](https://mastodon.online/@cryptomator) teilen. Und falls etwas nicht wie erwartet funktioniert, freuen wir uns über eine Meldung auf [GitHub](https://github.com/cryptomator/android/issues).

Stay safe. Stay encrypted.
