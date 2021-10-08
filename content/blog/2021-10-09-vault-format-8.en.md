---
title: "Vault Format 8"
slug: vault-format-8
date: 2021-10-09
tags: [cryptomator, vault-format]

summary: "We’d like to give you some information about an important part of the upcoming 1.6.0 release (ETA end of this month): The new vault format in version 8."
---

Hello Community!
We’d like to give you some information about an important part of the upcoming 1.6.0 release: The new vault format in version 8.
​
Yes, a new vault format. The ones who remember the last upgrade might start to groan, because last time the migration process from vault format 6 to 7 was in some cases not without hiccups.
But don't worry, this time the changes are significantly less invasive!
​
This article will give motivation for designing the new format, what the changes are in detail, and sketches how the migration process looks like, such that you know what you are up to.
​
## The Motivation
The storage location of the masterkey is a topic, which in the early days of Cryptomator already raised a lot of questions and led to several feature requests. (e.g., look at the number of clicks in https://community.cryptomator.org/t/why-is-the-masterkey-stored-in-the-cloud/)
So, what is all the fuss about?
The masterkey of a vault is stored within the vault structure in a file called `masterkey.cryptomator` and encrypted with state-of-the-art algorithms.
Its location is not a security risk and, additionally, the location ensures that this integral part of a vault is always moved with the vault.
Admittedly, calling the file "masterkey" is an arguable decision, but it’s definitely obvious that the file is important.
​
But this isn't about the name.
By hardwiring where the masterkey is stored, we lose flexibility to load it from somewhere else. (A relating [feature request](https://github.com/cryptomator/cryptomator/issues/96) is under the first 100 tickets of Cryptomator!)
What if a user has a hardware token which could store it?
Or what if a company has a centralized key management with [single sign-on] (https://en.wikipedia.org/wiki/Single_sign-on) and wants to use it with Cryptomator?
And even if workarounds for the above questions are found, how to deal with them when the vault structure/format changes?
​
These questions led to the idea of decoupling the masterkey retrieval from the vault structure and eventually into the design of vault format 8.
​
## The Changes
​
With vault format 8, we introduce a new file named `vault.cryptomator` for every vault located in the vault root.
This is the vault configuration file. Together with the data directory named `d`, they form the required minimum for a valid vault.
​
The vault config file is a [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) containing the basic information about the vault (like a unique identifier) and especially where to load the masterkey from.
All other parameters that are required to derive the masterkey are not stored in the vault config anymore, which decouples the key derivation from the vault format itself and opens the door to get the masterkey from other sources than just the `masterkey.cryptomator` file inside the vault.
For example, in future releases, you might be able to store the vault masterkey inside a [Yubikey](https://www.yubico.com) or the Microsoft Certification Store.
Additionally, with the vault config being a JWT, it is signed by the masterkey itself and ensures that nobody tampered with it.
​
As noted above, the vault config file can also store additional information.
One is the vault-specific threshold of shortening _encrypted_ filenames.
Before format 8, this value was set in stone in Cryptomator’s encryption scheme.
By specifying it in the vault config, it can be configurable in the future, such that the full capabilities of a vault are also available on more restrictive storage locations.
​
The encryption scheme, the directory structure, and encrypted files stay the same.
​
## The Migration
​
What do these changes mean for a migration from vault format 7 to 8? Nearly nothing!
​
The only file edited is `masterkey.cryptomator`.
Hence, for all "online only" users, it would be sufficient to only download this file.
​
For the migration process itself, first, the vault config file `vault.cryptomator` will be created and filled with the correct values like the aforementioned unique vault identifier and the filename shortening threshold.
Second, the already present masterkey file is updated.
And third… that's already it. :smile: No other files need to be altered.
​
As you can see, vault format 8 only imposes a small and easy to migrate change, while making way for interesting and exciting new features. 
With updating to Cryptomator 1.6.0, vaults of a former version need to be migrated and newly created ones will already be in format 8.
Keep in mind that the masterkey file is still needed, since it securely contains the actual key to your vault.​

We hope that your worries about a vault upgrade are reduced and you are eager to update!
If you want to know more about the upcoming 1.6.0 version of Cryptomator, continue reading the [article](https://cryptomator.org/blog/2021/10/09/1-6-0-what-you-need-to-know/) about it.
