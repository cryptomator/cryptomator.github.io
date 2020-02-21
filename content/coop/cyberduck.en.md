---
title: "Cyberduck"
prio: 40
img: /img/coop/cyberduck.png
img2x: /img/coop/cyberduck@2x.png
description: "Cyberduck is a libre remote file browser for Mac and Windows. As of version 6.0, Cyberduck supports Cryptomator vaults and thus is the perfect tool for all, who do not want to synchronize their cloud files locally."
aliases: ["/coop/cyberduck_en.html"]
---

<figure class="text-center my-8">
  <img class="inline-block rounded mb-1" src="/img/coop/cyberduck-banner.jpg" srcset="/img/coop/cyberduck-banner.jpg 1x, /img/coop/cyberduck-banner@2x.jpg 2x" alt="Cyberduck meets Cryptomator"/>
  <figcaption>
    <p class="text-sm text-gray-500"> Illustration by {{<extlink "https://ktoons.org" "Katharina Hagemann">}}</p>
  </figcaption>
</figure>

Cyberduck allows access to your cloud storage without an additional sync client. FTP, SFTP, WebDAV, Amazon S3, OpenStack Swift, Backblaze B2, Microsoft Azure & OneDrive, Google Drive, and Dropbox are the supported protocols. As of version 6.0, Cyberduck is compatible with Cryptomator and uses the same client-side encryption. All vaults created with one of the applications can be opened with the other.

We are excited about this cooperation because it allows you to access your vaults in a new way: Cryptomator is designed to operate on a local copy of the cloud data. Such copy is usually created by the sync client of your cloud provider. With Cyberduck, access to Cryptomator vaults is now possible without a local copy. Files are only loaded on demand when accessing them.

Thus, Cyberduck is the perfect addition to Cryptomator for those, who do not want a local copy of their files, but only want to load files on demand.

Cyberduck is open-source software, too. The same principles which apply to Cryptomator apply to Cyberduck as well. Everybody can view the source code, thus it is impossible to implement backdoors or to hide vulnerabilities.

Cyberduck uses the same Java-based cryptographic library {{<extlink "https://github.com/cryptomator/cryptolib" "CryptoLib">}} as the desktop version and Android app of Cryptomator.

<p class="text-center">
  <a class="btn btn-primary" href="https://cyberduck.io/cryptomator" target="_blank" rel="noopener"><i class="fas fa-link"></i> Visit cyberduck.io</a>
</p>
