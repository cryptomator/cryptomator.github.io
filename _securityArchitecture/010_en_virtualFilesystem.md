---
language: en
anchor: virtualFilesystem
title: Virtual Filesystem
---
<p class="lead">Cryptomator provides a virtual drive. Add, edit, remove files as you&apos;re used to with just any disk drive.</p>

Currently WebDAV is our frontend of choice, as it is supported on every major operating system. WebDAV is an HTTP-based protocol, in which Cryptomator acts as a server accepting so-called loopback connections on your local machine only. Whenever your file manager accesses files through this protocol, Cryptomator will process this request via the following layers.
