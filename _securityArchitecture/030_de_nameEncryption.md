---
language: de
anchor: nameEncryption
title: Verschlüsselung des Dateinamens
---
<p class="lead">Neben den Inhalten werden auch die Namen von Dateien und Ordnern verschlüsselt.</p>

Jeder Ordner erhält zunächst eine eindeutige ID. Die ID des ROOT-Verzeichnisses ist ein Sonderfall und immer leer. Für alle anderen Verzeichnisse wird eine <abbr title="Universally unique identifier" class="initialism">UUID</abbr> erstellt.
<pre>
dirId := createUuid()
</pre>

Cryptomator nutzt dann <a href="http://tools.ietf.org/html/rfc5297" target="_blank">AES-SIV</a>, um den Namen von Dateien und Verzeichnissen zu verschlüsseln. Die eindeutige ID des Ordners, indem sich die Datei oder der Ordner bedindet, wird als Zusatzdaten übergeben. Dies verhindert das unerkannte Verschieben von verschlüsselten Dateien in andere Verzeichnisse.

<img src="/img/architecture/filename-encryption.png" srcset="/img/architecture/filename-encryption.png 1x, /img/architecture/filename-encryption@2x.png 2x" alt="Verschlüsselung des Dateinamen" />
<figcaption>* Eindeutige Kennzeichnung wird für jedes Verzeichnis erstellt</figcaption>
<br>
<pre>
ciphertextName := base32(aesSiv(cleartextName, parentDirId, encryptionMasterKey, macMasterKey))
</pre>

Handelt es sich um eine Datei wird nun eine Datei mit diesem Namen in das entsprechende Verzeichnis abgelegt.

Handelt es sich hingegen um einen Ordner, wird eine Null vorangestellt. Dann wird eine Datei dieses Namens erstellt, in die die eindeutige ID des Verzeichnisses geschrieben wird. Die Dateien und Ordner, die innerhalb dieses Verzeichnisses liegen, werden an einem anderen Ort gespeichert und zwar:

<pre>
dirIdHash := base32(sha1(aesSiv(dirId, null, encryptionMasterKey, macMasterKey)))
dirPath := vaultRoot + &apos;/d/&apos; + substr(dirIdHash, 0, 2) + &apos;/&apos; + substr(dirIdHash, 2, 30)
</pre>

Somit entsteht aus einer verschachtelten Verzeichnis-Struktur wie z.B.:

<pre>
 a
 |- dataA.txt
 \- b
   |- data-data.txt
   \- c
      |- dataB.txt
      \- d
</pre>

Eine Struktur aus Verzeichnissen, die nebeneinanderliegen:
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
</pre>

Die verschleiert zum einen die Verzeichnishierarchie und begrenzt zum anderen die Pfadtiefe, um die Kompatibilität mit einigen Cloud-Diensten sicherzustellen.
