---
layout: post
title: "Cryptomator Roadmap Early 2020"
date: 2020-02-12
author: Sebastian Stenzel
authorlink: https://github.com/overheadhunter
authorimg: https://avatars0.githubusercontent.com/u/1204330?s=96
tags: [cryptomator, desktop, android]
stylesheets: ['/css/blog-post.css']

published: true
language: de
---
Bei all der Arbeit an Cryptomator müssen wir uns gelegentlich selbst an unser Vorhaben erinnern, euch über die Entwicklungsarbeiten auf dem Laufenden zu halten. Wie viele von euch schon bemerkt haben, geht es mit großen Schritten auf das nächste größere Release von Cryptomator zu. Daher denke ich, ist es an der Zeit ein kurzes Statusupdate sowie einen Ausblick zu geben.


### Status der Desktop-Anwendung
Wir planen noch in Q1 2020 Version 1.5.0 zu releasen. Während der derzeit noch laufenden Beta-Phase (an dieser Stelle nochmal Danke an all unsere fleißigen Tester) haben wir bereits viele Problemchen behoben und sind überzeugt eine hervorragende Qualität abliefern zu können.

Über die [anstehenden Änderungen](https://community.cryptomator.org/t/handling-of-long-filenames-in-cryptomator-1-5-0/4191?u=overheadhunter) an unserem sog. _Tresorformat_ (d.h. der verschlüsselten Ordnerstruktur) haben wir bereits informiert. Ziel ist es zum einen die Kompatibilität mit einigen Cloud-Anbietern zu erhöhen, zum anderen die Komplexität für viele I/O-Operationen zu reduzieren. Aber eine viel offensichtlichere Änderung in 1.5.0 wird die Programmoberfläche (GUI) betreffen:

Diese haben wir nämlich nicht einfach nur _umgestaltet_, wir haben sie komplette neu geschrieben. Nahezu jede einzelne Zeile Code aus Cryptomator 1.4.x ist der Löschen-Taste zum Opfer gefallen. Warum sollte man so etwas tun? Nun, Programmcode _wächst_ um Laufe der Zeit. Und im Falle von Cryptomator wächst er seit inzwischen über sechs Jahren, als viele moderne Möglichkeiten uns noch nicht zur Verfügung standen und wir andere Annahmen über die Zukunft der Software getroffen haben. Durch die Neuentwicklung der Programmoberfläche konnten wir eine komplett neue Codestruktur planen, welche die Wartung, zukünftige Erweiterungen sowie die Einarbeitung neuer Entwickler in bestimmte Programm-Abschnitte einfacher macht.

Eins der vielen Ziele des Redesigns betraf die Neugestaltung des Tresor-Erstellungs-Prozesses, der für neue Nutzer so leicht verständlich wie möglich gestaltet werden sollte. Hierzu besuchten (und organisierten) wir mehrere Usability-Testessen in unserer Nähe und beobachteten Nutzer bei ihrem ersten Kontakt mit besagtem Prozess. Dies half uns insbesondere dabei, Fehlannahmen im Umgang mit bestimmten Funktionen nachzuvollziehen und unsere Workflows entsprechend anzupassen.


### Status der Android-App
Selbstverständlich wird die Android-App in Version 1.5.0 ebenfalls das neue Tresorformat 7 unterstützen. Darüber hinaus haben wir neben den üblichen Bugfixes einige neue Features vorbereitet:
* Bereits geladene Dateien werden auf dem Smartphone gecached. Wenn man eine Datei erneut öffnet (und sie nicht zwischenzeitlich auf einem anderen Gerät geändert wurde), wird sie vom lokalen Dateisystem geladen, was nicht nur Zeit sondern auch Datenvolumen spart.
* Der Auto-Upload für Fotos wurde deutlich verbessert. Hier wurden unter anderem auch Probleme nach dem Reboot von Android 10 behoben.
* Man hat jetzt die Möglichkeit, einen Tresor sofort beim Verlassen der App zu sperren.
* Last but not least: Viel unserer Nutzer vermeiden Google-Anwendungen und wünschen sich eine Möglichkeit die Android-App ohne den Google Play Store zu installieren. Wir haben viel Arbeit in einen alternativen Lizenz-Store gesteckt und hoffen die App bald auch direkt vertreiben zu können.


### Status der iOS-App
Die iOS-App erhält natürlich ebenfalls ein Update, um das neue Tresor-Format zu unterstützen. Darüber hinaus gibt es viele kleinere Verbesserungen unter der Haube, allerdings keine großen neuen Features. Caching gibt es allerdings hier schon und auch um den Google Play Store kommt man herum. :wink:

### Was muss vor dem finalen 1.5.0-Release noch getan werden?
Stand heute fehlen nur noch wenige Features (etwa die Nutzung des Wiederherstellungs-Schlüsses) und der letzte Feinschliff. Aber wir wollen sicher gehen, dass alle Mobil-Apps und auch Drittanbieter-Tools wie Cyberduck mit dem neuen Tresorformat kompatibel sind und befinden uns daher derzeit in einer etwas gedehnte Testphase mit bereits sehr ausgereiften Beta-Versionen. Für einige Bugfixes (etwa [diesen](https://github.com/cryptomator/cryptomator/issues/986)), warten wir derzeit noch auf einen Upstream-Fix.

Gleichzeitig bereiten wir unsere Dokumentation für 1.5.0 vor, gestalten eine neue FAQ-Sektion für unsere Website und integrieren die [neuen Übersetzungen](https://community.cryptomator.org/t/localization-of-cryptomator-1-5-0/4269?u=overheadhunter), die von unserer phantastischen Community regelmäßig beigetragen werden.

### Was steht danach an?
Direkt nach 1.5.0 wird der Wechsel von Java 11 auf Java 14 höchste Priorität haben. Letzteres bringt ein Packaging-Tool mit, auf das wir schon lange gewartet haben und für das wir derzeit ein Workaround nutzen, welches ein Upgrade der gebundelten JRE verhindert. Da dies hoffentlich nur eine sehr kleine Änderung ist, wird sie vermutlich schon mit 1.5.1 nachgeschoben. Dennoch wagen wir es nicht, kurz vor 1.5.0 noch neue Fässer aufzumachen und entschieden diesen Technologiewechsel auf 1.5.1 zu verschieben.

Anschließend wollen wir uns auf Flatpak konzentrieren. Der Distribution von `.deb` und `.rpm`-Dateien haben wir schon lange abgeschworen und sie durch die universellen AppImages ersetzt. Gleichzeitig finden wir es toll, wie viel Momentum das Flatpak-Ökosystem derzeit gewinnt und wie dieses Format von einer stetig zunehmenden Anzahl an Distributionen nativ unterstützt wird. Bisher haben wir Cryptoamtor aufgrund der Komplexität beim Einbinden von Laufwerken [zwar noch nicht zum Laufen bekommen](https://github.com/cryptomator/cryptomator/issues/729), aber sobald wir 1.5.0 über die Bühne gebracht haben, hoffen wir diesem Problem mehr Aufmerksamkeit widmen und Cryptomator bald auch als Flatpak anbieten zu können.

Bei der Android-App steht als nächstes großes Feature an, anderen Apps Dateien per DocumentProvider bereistellen zu können. Zum Beispiel würde ein Dateibrowser dadurch in die Lage versetzt, auf Tresorinhalte zuzugreifen. Darüber hinaus sind auch kleinere Features wie rekursive Uploads von Ordnern geplant.