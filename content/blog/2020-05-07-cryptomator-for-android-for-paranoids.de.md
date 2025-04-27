---
title: "Cryptomator Android-App für uns Paranoide"
slug: cryptomator-for-android-for-paranoids
date: 2020-05-07
author: Julian Raufelder
authorlink: https://github.com/SailReal
authorimg: https://avatars.githubusercontent.com/u/1786772?s=96
tags: [cryptomator, android]

summary: Cryptomator für Android ohne Internet-Zugriffsrechte verwenden, um Hintertüren fast unmöglich zu machen.
---

Dieser Blogeintrag richtet sich an die Cryptomator-"Power-User" unter uns und beschreibt, wie man das Vertrauensverhältnis zur Cryptomator Android-App vollständig herstellen kann.

Wenn es um unsere Desktop-Anwendung geht, fordern wir, dass Sie uns nicht vertrauen müssen, aber Sie (oder zumindest viele Entwickler) stattdessen überprüfen können, was Cryptomator tut. Für unsere mobilen Anwendungen ist dies, offen gesagt, nur die halbe Wahrheit. Während der Verschlüsselungscode vollständig open-source ist, ist der UI- und Cloud-Zugriffscode (noch :wink:) nicht.   
Wenn Sie sich zu den paranoideren Benutzern zählen, die es vorziehen, alles selbst zu kompilieren, könnten Sie die berechtigte Frage stellen: Wie können Sie die aktuelle, offene App auf Hintertüren überprüfen?

Eine Backdoor erfordert Kommunikation mit einem externen Server. Wenn Tresore nur aus dem Dateisystem des Gerätes geöffnet werden, benötigt die Cryptomator-App keine Internetverbindung. Alternativ kann der Tresor auch auf das Dateisystem des Smartphones mit einer Dritt-Applikation wie zum Beispiel {{< extlink "https://syncthing.net/" "Syncthing" >}} bidirektional synchronisiert werden.

Verwendet man dieses Setup, kann die Internet-Berechtigung der Cryptomator-App entzogen werden, wodurch die App anschließend keine Daten aus dem Internet empfangen oder senden kann.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-for-paranoids-permission.png" alt="Internet-Berechtigung für Cryptomator auf Android entziehen" />
</figure>

Selbst wenn es also jemals eine Hintertür in der Cryptomator Android-App gäbe, wäre es nicht möglich, dass die abgefangenen Daten das Smartphone verlassen. Dies wird durch das Betriebssystem sichergestellt.
