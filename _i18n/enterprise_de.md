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
      CryptoLib ist eine Java-7-kompatible Bibliothek, welche High-Level-API-Funktionen zur Verwendung von nach <a href="/de/security/architecture">Cryptomator-Verschlüsselungsschema</a> verschlüsselten Daten anbietet.
    url: https://github.com/cryptomator/cryptolib
  - title: CryptoFS
    description: >
      CryptoFS ist eine Java 8-kompatible Bibliothek, die Dateien nach dem <a href="/de/security/architecture">Cryptomator-Verschlüsselungsschema</a> ver- und entschlüsselt. CryptoFS implementiert einen <code>java.nio.file.spi.FileSystemProvider</code> gemäß JSR-203. Die Verschlüsselung erfolgt durch Nutzung der Bibliothek CryptoLib.
    url: https://github.com/cryptomator/cryptofs
  - title: WebDAV-NIO-Adapter
    description: >
      WebDAV-NIO-Adapter ist ein Adapter zwischen zwei standardisierten Filesystem-Interfaces. Nach außen („Provided Interface“) wird ein WebDAV-Zugriff auf Dateien („Resources“) und Ordner („Collections“) ermöglicht. Intern („Required Interface“) werden die Zugriffe dann auf ein Java-NIO-Filesystem abgebildet.
    url: https://github.com/cryptomator/webdav-nio-adapter
  - title: WebDAV-NIO-Adapter-Servlet
    description: >
      WebDAV-NIO-Adapter-Servlet stellt die Inhalte eines Ordners, der durch ein <code>java.nio.file.Path</code> spezifiziert, über ein WebDAV-Servlet bereit.
    url: https://github.com/cryptomator/webdav-nio-adapter-servlet
  - title: FUSE-NIO-Adapter (Beta)
    description: >
      FUSE-NIO-Adapter ist ein Adapter zwischen zwei standardisierten Filesystem-Interfaces. Die Bibliothek stellt die Inhalte eines Ordners, der durch ein <code>java.nio.file.Path</code> spezifiziert ist, über ein FUSE-Dateisystem bereit.
    url: https://github.com/cryptomator/fuse-nio-adapter
  - title: Dokany-NIO-Adapter (Beta)
    description: >
      Dokany-NIO-Adapter ist ein Adapter zwischen zwei standardisierten Filesystem-Interfaces. Die Bibliothek stellt die Inhalte eines Ordners, der durch ein <code>java.nio.file.Path</code> spezifiziert ist, über ein Dokany-Dateisystem bereit.
    url: https://github.com/cryptomator/dokany-nio-adapter
---
