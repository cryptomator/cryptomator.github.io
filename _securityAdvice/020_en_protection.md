---
language: en
anchor: protection
title: What does Cryptomator protect me against?
---
<p class="lead">Cryptomator was designed to solve privacy issues when saving files to cloud storage.</p>

The risk that the cloud provider or third parties without permission access the data stored in the cloud is mitigated. Only people who know the vault password are able to read the files in the vault or change the file contents undetected. This is true for file contents as well as for file names.

To allow a working synchronization with the cloud, there are some meta information that Cryptomator does not encrypt. These are:

- the access-, modification- and creation-timestamp of files and folders,
- the number of files and folders in a vault and in the folders and
- the size of the stored files.

In addition one has to keep in mind what Cryptomator is not. Protection of the files on the local computer is not the focus of Cryptomator. Cryptomator is not a complete replacement for other encryption tools based on container files, if the meta information mentioned before should be encrypted. In addition Cryptomator does not provide protection if programs create backup copies of the encrypted files when working with them. Such files are not detected by Cryptomator and may remain on the computer even after unlocking a vault. In addition Cryptomator can not provide protection if the local computer is infected with malware which reads entered passwords and file contents (e.g. the files in an unlocked vault).

To protect against such risks, other methods, like a complete disk encryption, immediate installation of system- and softwareupdates and the use of applicable antivirus software is required.
