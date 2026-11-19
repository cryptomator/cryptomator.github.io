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

---

## Update: Apps, die noch nicht auf einen Tresor zugreifen oder ihn entsperren können

### Welche Apps funktionieren mit Cryptomator?

Kurz gesagt: jede App, die Dateien über die Dateiauswahl von Android öffnet und speichert. Das ist der Bildschirm, der in vielen Apps nach dem Tippen auf „Öffnen“ oder „Speichern unter“ erscheint und in jeder App gleich aussieht. Jeder Tresor ist dort neben Orten wie „Downloads“ aufgeführt. In der App selbst muss nichts eingerichtet werden.

Apps, die statt dieser Dateiauswahl nur ihre eigene Dateiliste oder Galerie anzeigen, können Tresore nicht sehen. In diesem Fall lässt sich eine Datei weiterhin aus der Dateien-App oder aus Cryptomator heraus öffnen und von dort an die andere App übergeben.

### Apps, die einen Tresor noch nicht entsperren können

Ist ein Tresor gesperrt, wenn eine andere App [Dateien daraus anfragt](https://developer.android.com/guide/topics/providers/document-provider), teilt Cryptomator dieser App mit, dass der Tresor zuerst entsperrt werden muss, und nutzt dafür den Mechanismus, den Android genau für diesen Fall vorsieht. Die Dateien-App des Systems zeigt dann eine Schaltfläche zum Entsperren an und macht danach weiter. Viele Dateimanager und Editoren von Drittanbietern unterstützen das noch nicht: Sie zeigen nur einen Fehler an und bieten keine Möglichkeit zum Entsperren. Android [verpflichtet Apps nicht dazu](https://developer.android.com/reference/android/provider/DocumentsProvider), diesen Fall zu behandeln. Es handelt sich also um eine fehlende Funktion, nicht um einen Fehler in diesen Apps.

Bis diese Apps nachziehen, muss der Tresor in Cryptomator entsperrt werden, bevor er aus einer solchen App geöffnet wird. Danach funktioniert alles wie gewohnt. Wir gehen auf die Entwickler dieser Apps zu und bitten sie, die Unterstützung zu ergänzen. Eine App kann nicht auf einen Tresor zugreifen oder ihn nicht entsperren? Dann freuen wir uns über einen Hinweis als Antwort auf unsere Ankündigung auf [Mastodon](https://mastodon.online/@cryptomator/117641997591859446), [Reddit](https://www.reddit.com/r/Cryptomator/comments/1y03y6n/the_document_provider_for_android_is_officially/), [LinkedIn](https://www.linkedin.com/posts/skymatic_cryptomator-for-android-300-encrypted-activity-7529092970919170048-EDNw), [Instagram](https://www.instagram.com/p/Df6mf1mihX1/) oder [Facebook](https://facebook.com/reel/1703752294790585/) sowie im [Community-Forum](https://community.cryptomator.org/t/the-document-provider-for-android-is-here/17817), damit wir die Maintainer kontaktieren können.

Als Übergangslösung wird eine kommende Version von Cryptomator eine Benachrichtigung anzeigen, sobald eine App auf einen gesperrten Tresor stößt. Ein Tippen öffnet den Entsperrdialog über der aktuellen App, danach muss die Aktion dort nur noch wiederholt werden. Das ist ein Workaround und keine echte Lösung, denn nur die App selbst kann dort weitermachen, wo sie unterbrochen wurde.

### Für App-Entwickler: Mit einem gesperrten Tresor umgehen

Ein `DocumentsProvider` darf bei jedem Aufruf über `ContentResolver` oder `DocumentsContract` eine [`android.app.AuthenticationRequiredException`](https://developer.android.com/reference/android/app/AuthenticationRequiredException) werfen (ab API 26, eine Unterklasse von `SecurityException`), etwa bei `query`, `openInputStream`/`openFileDescriptor`, `createDocument`, `renameDocument` oder `deleteDocument`. Für die Unterstützung braucht es drei Schritte:

1. `AuthenticationRequiredException` rund um Aufrufe mit Dokument-URIs abfangen.
2. Den [`PendingIntent`](https://developer.android.com/reference/android/app/PendingIntent) aus `getUserAction()` aus einer Activity heraus mit `startIntentSenderForResult` starten (oder mit dem Activity-Result-Contract [`StartIntentSenderForResult`](https://developer.android.com/reference/androidx/activity/result/contract/ActivityResultContracts.StartIntentSenderForResult)).
3. Bei `RESULT_OK` den fehlgeschlagenen Aufruf wiederholen. Bei jedem anderen Ergebnis den üblichen Fehler anzeigen.

Am besten geschieht das an einer zentralen Stelle statt pro Bildschirm, damit sich Auflisten, Anzeigen, Kopieren und Speichern gleich verhalten. Aus Hintergrundarbeit wie Vorschaubildern oder stillen Aktualisierungen heraus sollte der Dialog nicht gestartet werden. In einem Proof of Concept für einen Dateimanager kam die gesamte Änderung auf rund 170 Zeilen. Nichts davon ist spezifisch für Cryptomator: Jeder [Document Provider](https://developer.android.com/guide/topics/providers/create-document-provider) mit einer Sperre oder einer abgelaufenen Anmeldung kann dasselbe Signal verwenden.
