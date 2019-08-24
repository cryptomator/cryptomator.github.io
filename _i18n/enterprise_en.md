---
language: en
context: enterprise

title: Enterprise
subtitle: Customize Cryptomator for Your Organization
whitelabel:
  title: White Labeling
  content: >
    End-to-end encryption with your branding: We develop individualized versions of the Cryptomator apps for you.
libraries:
  title: Crypto Libraries
  content: >
    Secure your server applications, synchronization clients, and other systems with Cryptomator technology: Our libraries can be integrated into many applications.
development:
  title: Custom Development
  content: >
    Based on Cryptomator's encryption scheme, we develop custom applications and systems for you.
contactUs: Contact Us for an Offer

defendor:
  subtitle: Secure Workspaces for Your Network Drives
  teaser: >
    Are you looking for a way to make your network drives more secure? Since Cryptomator is optimized for cloud storages and mainly used by consumers, we've been working on Cryptomator Server which is a new tool made for businesses and teams. Cryptomator Server adds security features, such as anti-malware filters, file encryption, file versioning, and backups, to your corporate cloud- or network-based file storages.
  action: Visit server.cryptomator.org
  url: https://server.cryptomator.org/en

libs:
  subtitle: Open-Source Libraries Under AGPLv3
  teaser: >
    Cryptomator's libraries are dual-licensed under the AGPLv3 for FOSS projects as well as a commercial license derived from the LGPL for independent software vendors and resellers. If you want to use these libraries in applications that are not licensed under the AGPL, feel free to contact our <a href="mailto:sales@cryptomator.org">sales team</a>.
  list:
  - title: CryptoLib
    description: >
      Use CryptoLib for encrypting and decrypting data according to <a href="https://docs.cryptomator.org/en/latest/security/architecture/" target="_blank">Cryptomator's encryption scheme</a>.
      <ul>
        <li>Encrypt and decrypt Cryptomator vaults directly retrieved from the cloud
        <li>Suitable for accessing the cloud directly without synchronization, e.g. in apps for Android™
        <li>High-level API functions for encryption and decryption
        <li>Java 7+ compatible
      </ul>
    url: https://github.com/cryptomator/cryptolib
  - title: CryptoFS
    description: >
      Use CryptoFS for encrypting and decrypting data according to <a href="https://docs.cryptomator.org/en/latest/security/architecture/" target="_blank">Cryptomator's encryption scheme</a>.
      <ul>
        <li>Encrypt and decrypt Cryptomator vaults that are present on the local filesystem
        <li>Suitable for accessing data synchronized to a local directory
        <li>Implements a <code>java.nio.file.spi.FileSystemProvider</code> according to JSR-203 using the CryptoLib library
        <li>Java 8+ compatible
      </ul>
    url: https://github.com/cryptomator/cryptofs
  - title: WebDAV-NIO-Adapter-Servlet
    description: >
      Add a WebDAV server to your Java application.
      <ul>
        <li>Make the contents of a local directory (any <code>java.nio.file.Path</code>) available via WebDAV
        <li>Provides a JEE servlet
        <li>Java 8+ compatible
      </ul>
    url: https://github.com/cryptomator/webdav-nio-adapter-servlet
  - title: WebDAV-NIO-Adapter
    description: >
      Launch and mount a WebDAV server from within your Java application.
      <ul>
        <li>Mounting support for Windows, macOS, and Linux
        <li>Based on WebDAV-NIO-Adapter-Servlet
        <li>Java 8+ compatible
      </ul>
    url: https://github.com/cryptomator/webdav-nio-adapter
  - title: FUSE-NIO-Adapter
    description: >
      Provide a FUSE drive from within your Java application.
      <ul>
        <li>Make the contents of a local directory (any <code>java.nio.file.Path</code>) available via FUSE
        <li>Mounting support for macOS and Linux
        <li>Java 9+ compatible
      </ul>
    url: https://github.com/cryptomator/fuse-nio-adapter
  - title: Dokany-NIO-Adapter
    description: >
      Provide a Dokany drive from within your java application.
      <ul>
        <li>Make the contents of a local directory (any <code>java.nio.file.Path</code>) available via Dokany
        <li>Mounting support for Windows
        <li>Java 8+ compatible
      </ul>
    url: https://github.com/cryptomator/dokany-nio-adapter
---
