---
language: en
anchor: nameShortening
title: Name Shortening
---
<p class="lead">This layer doesn&apos;t modify any file contents. Its sole purpose is to limit the path length to ensure compatibility with certain Microsoft products, that do not support long paths.</p>

Even with the flattened directory structure [achieved during filename encryption](#nameEncryption), the file path might be longer than 255 characters. So whenever a filename reaches a certain threshold, it is replaced by its much shorter SHA-1 hash and gets a <code>.lng</code> file extension. Additionally an equally named metadata file is created in the <code>m</code> directory containing a reverse-mapping back to the original name.

This layer doesn&apos;t provide any additional security. Its sole purpose is to maximize compatibility.
