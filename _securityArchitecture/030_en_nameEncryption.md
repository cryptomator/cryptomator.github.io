---
language: en
anchor: nameEncryption
title: Filename Encryption
---
<p class="lead">Before we deal with the actual file contents, filenames get encrypted.</p>

Cryptomator uses <a href="http://tools.ietf.org/html/rfc5297" target="_blank">AES-SIV</a> to encrypt file as well as directory names. Additionally to the name, a unique directory ID of its parent directory is passed as associated data.

<pre>
cipheredName := base32(aesSiv(cleartextName, parentDirId, encryptionMasterKey, macMasterKey))
</pre>

If it&apos;s a filename, we&apos;re done!

If it&apos;s a directory name, we append an underscore. We then create a file with this name, in which we write a unique identifier (i.e. <abbr title="Universally unique identifier" class="initialism">UUID</abbr>). The corresponding directory however is stored in a different location:

<pre>
dirId := createUuid()
dirIdHash := base32(sha1(aesSiv(dirId, null, encryptionMasterKey, macMasterKey)))
dirPath := vaultRoot + &apos;/d/&apos; + substr(dirIdHash, 0, 2) + &apos;/&apos; + substr(dirIdHash, 2, 30)
</pre>

By making all directories effectively siblings (or cousins to be precise), we not only obfuscate the directory hierarchy but also limit path depth regardless of its actual hierarchy to ensure compatiblity with some cloud services.
