---
title: "How is Cryptomator different than VeraCrypt?"
date: 2020-01-01T00:13:37+00:00
draft: false
weight: 2
---

VeraCrypt is a great tool for encryption local hard drives. With VeraCrypt all your files are bundled in a single encrypted container. A change in one small file would cause the whole container to be updated. While this works flawlessly on local devices, most cloud services would attempt to sync the whole container.

Cryptomator on the other hand encrypts each file individually. If you update one document, only these changes will get synchronized.