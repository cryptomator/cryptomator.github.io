---
title: "Two Betas: Document Provider for Android and FSKit for Mac"
slug: beta-document-provider-fskit
date: 2026-10-30
tags: [cryptomator, android, desktop, macos, beta]

summary: "Two new betas are ready for testing. On Android, the long-awaited Document Provider brings your vaults right into the Files app. On the Mac, FSKit lets you show unlocked vaults as a drive with nothing extra to install. Join the betas and help us get both ready for release!"

ogimage:
  relsrc: /img/blog/beta-document-provider-fskit.png
  width: 1200
  height: 675
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/beta-document-provider-fskit.png" alt="Cryptomator Betas: Document Provider for Android and FSKit for Mac" />
</figure>

There are not one, but two new betas. One brings a feature many of you have been asking for. The other makes using Cryptomator on your Mac a whole lot easier. Before both land in stable releases, you can test them now and share your feedback.

## Android: The Document Provider Is Finally Here

The Document Provider is the **most-requested feature** of our Android app. Many of you have asked for it on GitHub, in the forum, and in app reviews. **Now it's finally here!**

Until now, opening a file from your vault in another app took several steps. You had to open Cryptomator, unlock the vault, navigate to the file, and tap it to open it in the other app.

With the Document Provider, your vaults show up **directly in the Android Files app and in the system file picker**. Any app that supports it can open, save, create, rename, move, and delete files inside your vault, without a detour through Cryptomator. And of course, everything stays protected by **client-side encryption**. Your files are encrypted on your device **before** they reach the cloud, just like before.

### 📂 Your Vaults in the Files App

Each vault gets its own entry in the Files app. If a vault is locked, just tap it and unlock it right there. Images get thumbnails, so you can find that one photo without opening every single file.

Don't want your vaults to appear there? Turn off **"Show vaults in the Files app"** in the settings.

### 💾 Save and Keep Going

When you save a file from another app, Cryptomator uploads it in the background. If the file was changed in the cloud in the meantime, nothing gets overwritten. Cryptomator saves your version as a separate **conflict copy** instead.

### 🔒 Smarter Auto-Lock

"Lock after" now counts from the last time the vault was used, including access from other apps. That way, your vault won't lock while you're still editing a document somewhere else. The new **"Wait for transfers"** setting (on by default) also keeps your vault unlocked until running uploads are finished. "Lock all" still locks everything immediately.

### ⚡ A Faster In-App Browser

Don't worry, the in-app browser isn't going anywhere. You can still browse and manage your vaults right inside Cryptomator. It now uses the same cache as the Files app, so both always show the same state. Changes appear immediately, and upload progress shows right on each file. If the cloud rejects a change, Cryptomator lets you know and reverts it.

### Good to Know

Since this is a beta, there are a few things to keep in mind:

- **Opening a file for the first time can take a moment.** Files that aren't cached yet need to be downloaded first.
- **Failed uploads aren't retried automatically.** Pull down to refresh in the Files app or tap the file in Cryptomator to try again.
- **A new cache.** Folder contents and opened files are now cached locally in Cryptomator's private app storage and stay available after you lock the vault. You can clear the cache at any time in the settings. The previous cache settings have been removed.

### How to Join the Beta

How you join depends on where you got Cryptomator from.

**Got Cryptomator from Google Play?** [Open this link](https://play.google.com/apps/testing/org.cryptomator.freemium) and tap **"Become a tester"**. If you bought the full version without in-app purchases in the Play Store, use [this link](https://play.google.com/apps/testing/org.cryptomator) instead.

That's it! The beta then arrives through the Play Store like any other update.

**Got Cryptomator from our website or F-Droid?** Open the download page below and pick the file that matches where you got the app:

- Our website: `Cryptomator-3.0.0-beta1_signed.apk`
- Our F-Droid repository: `Cryptomator-3.0.0-beta1_fdroid_signed.apk`
- The main F-Droid repository: `Cryptomator-3.0.0-beta1_lite_signed.apk`

<div class="text-center">
  <a href="https://github.com/cryptomator/android/releases/tag/3.0.0-beta1"><i class="fa-solid fa-download"></i> Download the Android Beta here</a>
</div>

## Mac: Vaults as Drives with FSKit (Experimental)

If you use Cryptomator on a Mac, you probably know the routine. To show an unlocked vault as a drive, you first had to install **macFUSE or FUSE-T**. That meant a second download, approving a kernel extension, and on Apple silicon even a trip into Recovery Mode to change security settings, followed by a restart. "Why do I need this?" is one of the most common questions our support team gets, and a very fair one.

And setup was only the beginning. Many of you have told us about Finder freezing, vaults that won't lock, and drives that stop working after a major macOS update until a fixed driver is released.

With the new beta, we're introducing an alternative built on **FSKit**, Apple's own framework for file systems. It runs as an app extension right inside Cryptomator. So you need **neither macFUSE nor FUSE-T, and no separate FSKit extension either**.

### What FSKit Improves

- 📦 **Nothing extra to install.** No second download, no kernel extension, no Recovery Mode, no restart.
- 🍏 **Built on Apple's own technology.** Cryptomator no longer depends on a third-party driver, so you don't have to wait for another company's update after each macOS release.
- 💽 **Feels like a normal drive.** Vaults can open straight into `/Volumes` and keep their name in Finder.
- ⚡ **Faster with large files.** In our tests, reading large files was faster than with macFUSE.

### Requirements and Limitations

FSKit support is **experimental and opt-in**. We want to be upfront about what that means:

- **macOS 27 or later on Apple silicon is required.** Intel Macs aren't supported.
- **You switch it on yourself.** Choose FSKit as the volume type in Cryptomator's settings. macOS will then ask you once to enable the extension in System Settings.
- **Many small files are slower.** If you work with thousands of tiny files, FSKit is currently noticeably slower than macFUSE.
- **Finder tags and other extended attributes aren't preserved**, and hard links aren't supported.

If any of this is a dealbreaker, you can simply keep using macFUSE or FUSE-T as before.

### How to Join the Beta

Trying FSKit takes just three steps:

1. **Download Cryptomator 1.20.0-beta1** using the link below.
2. **Install it** like you normally would.
3. **Switch on FSKit** by choosing it as the volume type in Cryptomator's settings.

<div class="text-center">
  <a href="https://github.com/cryptomator/cryptomator/releases/tag/1.20.0-beta1"><i class="fa-solid fa-download"></i> Download the Mac Beta here</a>
</div>

## We Need Your Feedback!

As with any beta, please make sure you have a backup of your important data before testing. Then put both betas to work in your daily routine and tell us what works and what doesn't. On Android, try your favorite apps, whether that's notes, office, PDF readers, or photo editors. On the Mac, use your vaults in Finder just like you normally would.

Report bugs on GitHub for [Android](https://github.com/cryptomator/android/issues) or [Desktop](https://github.com/cryptomator/cryptomator/issues), or share your experience in our [Community forum](https://community.cryptomator.org/). Just want to tell us what you think? You'll also find us on [Mastodon](https://mastodon.online/@cryptomator) and [LinkedIn](https://www.linkedin.com/company/skymatic/).

Have you been waiting for the Document Provider for a long time? Thank you for your patience. 💚
