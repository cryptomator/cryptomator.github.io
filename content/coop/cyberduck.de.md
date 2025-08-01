---
title: "Cyberduck"
prio: 10
img: /img/coop/cyberduck.png
img2x: /img/coop/cyberduck@2x.png
description: "Cyberduck ist ein freier Remote-Dateibrowser für Mac und Windows. Ab Version 6.0 unterstützt Cyberduck Cryptomator-Tresore und ist somit perfekt für alle, die ihre Cloud-Daten nicht lokal synchronisieren wollen."
ctalink: https://cyberduck.io/cryptomator
ctatext: "Weitere Infos unter cyberduck.io"
aliases: ["/coop/cyberduck_de.html"]
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/coop/cyberduck-banner.jpg" srcset="/img/coop/cyberduck-banner.jpg 1x, /img/coop/cyberduck-banner@2x.jpg 2x" alt="Cyberduck meets Cryptomator"/>
  <figcaption>Illustration von {{< extlink "https://ktoons.org" "Katharina Hagemann" >}}</figcaption>
</figure>

Cyberduck erlaubt Ihnen den Zugriff auf Ihren Cloudspeicher ohne einen zusätzlichen Sync-Client. FTP, SFTP, WebDAV, Amazon S3, OpenStack Swift, Backblaze B2, Microsoft Azure & OneDrive, Google Drive und Dropbox werden unterstützt. Ab Version 6.0 ist Cyberduck kompatibel mit Cryptomator und verwendet die gleiche clientseitige Verschlüsselung. Alle Tresore, die mit einer der Anwendungen angelegt wurden, können entsprechend mit der anderen geöffnet werden.

Wir freuen uns über diese Kooperation, weil sie Ihnen eine neue Möglichkeit gibt, auf Ihre Tresore zuzugreifen: Cryptomator wurde so konzipiert, dass er auf einer lokalen Kopie der Cloud-Daten arbeitet. Diese wird überlicherweise durch einen Sync-Client des Cloud-Anbieters erzeugt. Mit Cyberduck ist nun der Zugriff auf Cryptomator-Tresore ohne eine lokale Kopie der Daten möglich. Dateien werden erst beim Zugriff geladen.

Cyberduck ist also die perfekte Ergänzung zu Cryptomator für alle, die keine lokale Kopie ihrer Cloud-Daten möchten, sondern die Daten nur beim Zugriff laden wollen.

Auch Cyberduck ist Open-Source-Software, d.h. die gleichen Prinzipien von Cryptomator gelten ebenso für Cyberduck. Jeder kann den Programmcode einsehen, daher ist es unmöglich, Hintertüren einzubauen oder Schwachstellen zu verheimlichen.

Cyberduck nutzt die Java-basierte kryptographische Bibliothek {{< extlink "https://github.com/cryptomator/cryptolib" "CryptoLib" >}}, die auch in der Desktop-Version und Android-App von Cryptomator zum Einsatz kommt.
