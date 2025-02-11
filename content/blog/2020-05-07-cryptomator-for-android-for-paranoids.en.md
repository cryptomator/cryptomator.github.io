---
title: "Cryptomator for Android for Us Paranoids"
slug: cryptomator-for-android-for-paranoids
date: 2020-05-07
author: Julian Raufelder
authorlink: https://github.com/SailReal
authorimg: https://avatars0.githubusercontent.com/u/1786772?s=96
tags: [cryptomator, android]

summary: Use Cryptomator for Android and revoke the app's internet permissions to make backdoors almost impossible.
---

This blog post is aimed towards the paranoid Cryptomator power users among us and describes how to fully establish a relationship of trust with Cryptomator for Android.

When it comes to our desktop application, we claim that you should in fact _not_ trust us but you (or at least many developers) can instead _inspect_ what Cryptomator is doing. For our mobile apps, this is only half the truth, frankly. While the encryption code is fully open-source, the UI and cloud access code isn't (yet :wink:).   
If you count yourself as one of the more paranoid users, who prefer to compile everything yourselves, you might ask the legitimate question: How can you check the current, open-core app for backdoors?

A backdoor usually requires communication with an external server. If vaults are only opened from the device's file system, the Cryptomator app does not require an internet connection. Alternatively, the vault can be synchronized bidirectionally to the file system of the smartphone with a third-party application such as {{< extlink "https://syncthing.net/" "Syncthing" >}}.

Using this setup, the Cryptomator app can have its internet access revoked using the Android operating system features, which prevents the app from sending or receiving any data to or from the internet.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-for-paranoids-permission.png" alt="Android revoke Cryptomator's internet permission" />
</figure>

Thus, even if there ever was a backdoor in Cryptomator for Android, it would not be possible for the intercepted data to leave the smartphone. This is ensured by the operating system.
