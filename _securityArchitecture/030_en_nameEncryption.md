---
language: en
anchor: nameEncryption
title: Filename Encryption
---
<p class="lead">Before we deal with the actual file contents, file and foldernames get encrypted.</p>

At first each folder gets a unique ID. The ID of the ROOT folder is special and always empty. For all other folders an <abbr title="Universally unique identifier" class="initialism">UUID</abbr> is created.
<pre>
dirId := createUuid()
</pre>

Cryptomator uses <a href="http://tools.ietf.org/html/rfc5297" target="_blank">AES-SIV</a> to encrypt file as well as directory names. The unique ID of the parent directory is passed as associated data. This prevents undetected moving of files between directories.

<img src="/img/architecture/filename-encryption.png" srcset="/img/architecture/filename-encryption.png 1x, /img/architecture/filename-encryption@2x.png 2x" alt="Filename Encryption" />
<figcaption>* Unique ID is created for each directory</figcaption>
<br>
<pre>
ciphertextName := base32(aesSiv(cleartextName, parentDirId, encryptionMasterKey, macMasterKey))
</pre>

If it&apos;s a file, a file with this name is created in the corresponding directory.

If it&apos;s a directory name, we prepend a zero. We then create a file with this name, in which we write the unique ID of the directory. The files and folders inside this directory are stored in a different location:

<pre>
dirIdHash := base32(sha1(aesSiv(dirId, null, encryptionMasterKey, macMasterKey)))
dirPath := vaultRoot + &apos;/d/&apos; + substr(dirIdHash, 0, 2) + &apos;/&apos; + substr(dirIdHash, 2, 30)
</pre>

Thus a nested directory structure like

<pre>
 a
 |- dataA.txt
 \- b
   |- data-data.txt
   \- c
      |- dataB.txt
      \- d
</pre>

becomes a structure of sibling directories
<pre>
 d
 |-L6
 | \- V4YL7GBW4A4KKNSSJXVSUVRWH3ONI6
 |    |- P6FBAFY7HJJLJYBY4IPZTWGMKKE2ONK3II======
 |    \- 0CEOH7OJH3CY6PUFTOTULXALNNCCE5CEOA6IMBW4X
 |-LN
 | \- T3MOJAPX7MHPV7HMUYRWVI76PUGDQG
 |    |- WPKQKC7NSNLMH7LCA3TGZVZXASK34C4JSF4ERZNO6AWFWF34A7SMO3XM
 |    \- 034GWQ2GONIZZPACRD6P2VBWQOPWHA27DYE5KGRRB
 |-Q2
 | \- LWWOK3BVOVNIW5FUQIAWUT2A64ZEE6
 \-YH
   \- UMPFQE22AFP66MQJUCZ4AOMMVZE522
      |- L76ZSEYYPGJJZM7YGANJO7JQVDGFQ7XXY6XDU4JH4MOZW4NWHFST4BQ=
      \- 0ZJAF3BSANWHI7Q5IM6UB6YCSXRD3MLRV2B76ZOY2
</pre>.

By making all directories effectively siblings (or cousins to be precise), we not only obfuscate the directory hierarchy but also limit path depth regardless of its actual hierarchy to ensure compatiblity with some cloud services.


