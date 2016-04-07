---
language: de
anchor: sizeObfuscation
title: Dateigrößen verschleiern
---
<p class="lead">To make it difficult to recognize a file based on a known size, a random-length padding is appended before encryption.</p>

Of course, the padding should be of an appropriate length, so we make its upper bound depend on the real file size.

<pre>
upperBound := max(min(10% * realFileSize, 16MiB), 4KiB)
paddingLength := randomInt(upperBound)
</pre>

The random padding length will be up to 10% of your real file size, but at least 0-4 KiB and not more than 16 MiB.

The content of the padding itself is unspecified as the real file size is stored in the file header and sufficient to determine the end of the real content.
