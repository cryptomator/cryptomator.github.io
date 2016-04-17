---
language: de
anchor: virtualFilesystem
title: Virtuelles Dateisystem
---

<p class="lead">Cryptomator stellt ein virtuelles Laufwerk bereit. Dateien lassen sich genauso hinzufügen, bearbeiten und entfernen, wie Sie es bei einem USB Stick gewöhnt sind.</p>

Zurzeit nutzen wir dazu WebDAV, da es von allen meistgenutzten Betriebssystemen unterstützt wird. WebDAV ist ein HTTP-basiertes Protokol, in dem Cryptomator als ein Server fungiert, der sogenannte Loopback-Verbindungen ausschließlich von Ihrem lokalen Gerät akzeptiert. Immer wenn Ihr Dateimanager durch dieses Protokoll auf Ihre Dateien zugreift, wird Cryptomator diese Anfrage durch die folgenden Schichten verarbeiten.
