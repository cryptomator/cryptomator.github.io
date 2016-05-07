---
language: en
anchor: virtualFilesystem
title: Virtual Filesystem
---
<p class="lead">Cryptomator provides a virtual drive. Add, edit, remove files as you&apos;re used to with just any disk drive.</p>

Files are transparently en- and decrypted. There are no unencrypted copies on your hard disk drive. With every access on your files inside the virtual drive, Cryptomator will en- and decrypt these files on-the-fly.

Currently WebDAV is our frontend of choice, as it is supported on every major operating system. WebDAV is an HTTP-based protocol and Cryptomator acts as a WebDAV server accepting so-called loopback connections on your local machine only. Whenever your file manager accesses files through this protocol, Cryptomator will process this request via the following layers.
