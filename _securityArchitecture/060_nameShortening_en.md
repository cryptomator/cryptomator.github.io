---
language: en
anchor: nameShortening
title: Name Shortening
---
<p class="lead">This layer doesn&apos;t modify any file contents. Its sole purpose is to limit the path length to ensure compatibility with certain Microsoft products that do not support long paths.</p>

Even with the flattened directory structure [achieved during filename encryption](#nameEncryption), the file path might be longer than 255 characters. If a ciphertext filename exceeds the threshold of 129 characters, it is replaced by its much shorter SHA-1 hash and gets a <code>.lng</code> file extension. Additionally, an equally named metadata file is created in the <code>m</code> directory containing a reverse-mapping back to the original name.

<pre>
if (length(ciphertextName) <= 129) {
  inflatedName := ciphertextName
} else {
  inflatedName := base32(sha1(ciphertextName)) + '.lng'
  metadataPath := vaultRoot + '/m/' + substr(inflatedName, 0, 2) + '/' + substr(inflatedName, 2, 2)
  metadataContent := ciphertextName
}
</pre>

This layer doesn&apos;t provide any additional security. Its sole purpose is to maximize compatibility.
