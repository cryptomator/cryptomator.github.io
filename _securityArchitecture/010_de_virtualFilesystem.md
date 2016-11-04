---
language: de
anchor: virtualFilesystem
title: Virtuelles Dateisystem
---
<p class="lead">Cryptomator stellt ein virtuelles Laufwerk bereit. Dateien lassen sich genauso hinzufügen, bearbeiten und entfernen, wie Sie es bei einem USB-Stick gewöhnt sind.</p>

Die Daten werden mit sogenannter "transparenter" Verschlüsselung ver- und entschlüsselt. Das bedeutet, dass es keine unverschlüsselte Version einer Datei auf Ihrer Festplatte gibt. Immer wenn Sie auf Ihre Dateien zugreifen, wird Cryptomator darüber informiert und wird in diesem Moment die Daten ver- bzw. entschlüsseln.

Zurzeit verwendet Cryptomator das WebDAV-Protokoll, da dieses durch die Betriebssysteme Windows, Mac und Linux unterstützt wird. WebDAV basiert auf dem HTTP-Protokoll und wird genutzt, um Cryptomator als Server agieren zu lassen, der nur sogenannte Loopback-Verbindungen mit dem eigenen Rechner zulässt. Sobald das Dateisystem durch dieses Protokoll auf Dateien zugreifen will, bearbeitet Cryptomator diese Anfrage durch die im Folgenden beschriebenen Schichten.
