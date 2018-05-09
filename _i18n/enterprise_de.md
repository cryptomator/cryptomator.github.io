---
language: de
context: enterprise

title: Enterprise
subtitle: Setzen Sie Cryptomator in Ihrem Unternehmen ein
whitelabel:
  title: White-Labeling
  content: >
    Ende-zu-Ende Verschlüsselung mit den Cryptomator-Apps in Ihrem Markendesign: Wir entwickeln für Sie individuelle Versionen der Apps.
support:
  title: Support-Pakete
  content: >
    Für Ihre Anforderungen bieten wir unterschiedliche Support-Pakete an.
libraries:
  title: Krypto-Bibliotheken
  content: >
    Machen Sie Ihre Serveranwendungen, Synchronisationsclients und andere Systeme sicherer mit der Cryptomator-Technologie: Unsere Bibliotheken lassen sich in viele Anwendungen integrieren.
development:
  title: Individualentwicklung
  content: >
    Basierend auf dem Cryptomator-Verschlüsselungsschema entwickeln wir für Sie individuelle Anwendungen und Systeme.
contactUs: Kontaktieren Sie uns für ein Angebot

defendor:
  subtitle: Sichere Arbeitsbereiche für Ihre Netzlaufwerke
  teaser: >
    Suchen Sie nach einer Möglichkeit, Ihre Netzlaufwerke sicherer zu machen? Da Cryptomator für Cloudspeicher optimiert ist und hauptsächlich von Privatanwendern genutzt wird, bieten wir mit Defendor ein neues Tool für Unternehmen und Teams an. Defendor fügt Sicherheitsfunktionen wie Anti-Malware-Filter, Dateiverschlüsselung, Dateiversionierung und Backups zu Ihren Cloud- oder netzwerkbasierten Dateispeichern hinzu.
  action: Weitere Infos unter defendor.skymatic.de

libs:
  subtitle: Open-Source-Bibliotheken unter AGPLv3
  teaser: >
    Die Bibliotheken von Cryptomator sind unter der AGPLv3 für FOSS-Projekte sowie einer von der LGPL abgeleiteten kommerziellen Lizenz für unabhängige Softwareanbieter und Reseller lizenziert. Wenn Sie diese Bibliotheken in Anwendungen verwenden möchten, die nicht unter der AGPL lizenziert sind, wenden Sie sich bitte an unser <a href="mailto:sales@cryptomator.org">Sales-Team</a>.
  list:
  - title: CryptoLib
    description: >
      Nutzen Sie CryptoLib um Daten entsprechend des <a href="/security/architecture">Cryptomator Verschlüsselungsschemas</a> zu ver- und entschlüsseln.
      <ul>
        <li>Ver- und Entschlüsselung von Cryptomator Tresoren direkt aus der Cloud
        <li>Anwendbar für direkten Cloudzugriff ohne Synchronisierung, z.B. für Apps für Android™
        <li>High-level Funktionen für Ver- und Entschlüsselung
        <li>Java 7+ kompatibel
      </ul>
    url: https://github.com/cryptomator/cryptolib
  - title: CryptoFS
    description: >
      Nutzen Sie CryptoLib um Daten entsprechend des <a href="/security/architecture">Cryptomator Verschlüsselungsschemas</a> zu ver- und entschlüsseln.
      <ul>
        <li>Ver- und Entschlüsselung von Cryptomator Tresoren im lokalen Dateisystem
        <li>Nutzbar für den Zugriff auf Daten, die in ein lokales Verzeichnis synchronisiert wurden
        <li>Implementiert <code>java.nio.file.spi.FileSystemProvider</code> entsprechend JSR-203 durch Nutzung von CryptoLib
        <li>Java 8+ kompatibel
      </ul>
    url: https://github.com/cryptomator/cryptofs
  - title: WebDAV-NIO-Adapter-Servlet
    description: >
      Fügen Sie Ihrer Java-Anwendung einen WebDAV-Server hinzu.
      <ul>
        <li>Die Inhalte eines lokalen Verzeichnisses (jeder java.nio.file.Path) werden per WebDAV bereitgestellt.
        <li>Implementiert ein JEE Servlet
        <li>Java 8+ kompatibel
      </ul>
    url: https://github.com/cryptomator/webdav-nio-adapter-servlet
  - title: WebDAV-NIO-Adapter
    description: >
      Starten Sie einen WebDAV Server aus Ihrer Java-Anwendung und binden Sie diesen als Laufwerk ein.
      <ul>
        <li>Laufwerkseinbindung auf Windows, macOS und Linux
        <li>Basiert auf WebDAV-NIO-Adapter-Servlet
        <li>Java 8+ kompatibel
      </ul>
    url: https://github.com/cryptomator/webdav-nio-adapter
  - title: FUSE-NIO-Adapter (Beta)
    description: >
      Stellen Sie ein FUSE-Laufwerk aus Ihrer Java-Anwendung bereit.
      <ul>
        <li>Die Inhalte eines lokalen Verzeichnisses (jeder java.nio.file.Path) werden per FUSE bereitgestellt.
        <li>Laufwerkseinbindung auf macOS und Linux
        <li>Java 9+ kompatibel
      </ul>
    url: https://github.com/cryptomator/fuse-nio-adapter
  - title: Dokany-NIO-Adapter (Beta)
    description: >
      Stellen Sie ein Dokany-Laufwerk aus Ihrer Java-Anwendung bereit.
      <ul>
        <li>Die Inhalte eines lokalen Verzeichnisses (jeder java.nio.file.Path) werden per Dokany bereitgestellt.
        <li>Laufwerkseinbindung auf Windows
        <li>Java 8+ kompatibel
      </ul>
    url: https://github.com/cryptomator/dokany-nio-adapter
---
