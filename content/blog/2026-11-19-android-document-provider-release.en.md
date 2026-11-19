---
title: "The Document Provider for Android Is Here"
slug: android-document-provider-release
date: 2026-11-19
tags: [cryptomator, android, release]

summary: "Open and save encrypted files right inside any app: with Cryptomator for Android 3.0.0, the most-requested feature of our Android app is here."

ogimage:
  relsrc: /img/blog/android-document-provider-release.png
  width: 1200
  height: 675
---

Open and save encrypted files right inside any app: with **Cryptomator for Android 3.0.0**, the **most-requested feature** of our Android app is here.

<video class="rounded-sm" controls preload="none" poster="/img/blog/android-document-provider-video-thumbnail.png">
  <source src="https://static.cryptomator.org/blog/android-document-provider-release.mp4" type="video/mp4">
  This browser does not support video playback.
</video>

## What the Document Provider Does

Until now, opening a file from a vault in another app took several steps: open Cryptomator, unlock the vault, navigate to the file, and tap it to hand it over to the other app.

Now vaults appear **directly in the Android Files app and in the system file picker**. Any app that supports it can open, save, create, rename, move, and delete files inside a vault. Notes apps, office apps, PDF readers, and photo editors work with encrypted files just like with any other file.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-open-in-app.png" srcset="/img/blog/android-document-provider-open-in-app.png 1x, /img/blog/android-document-provider-open-in-app@2x.png 2x" alt="Opening a spreadsheet from a Cryptomator vault in an office app" />
</figure>

And of course, everything stays protected by **client-side encryption**. Files are encrypted on the device **before** they reach the cloud, whether that's Dropbox, Google Drive, OneDrive, or any other provider.

### 📂 Vaults in the Files App

Each vault gets its own entry in the Files app. A locked vault can be unlocked right there with a tap. Images get thumbnails, so that one photo is easy to find without opening every single file.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-unlock.png" srcset="/img/blog/android-document-provider-unlock.png 1x, /img/blog/android-document-provider-unlock@2x.png 2x" alt="Cryptomator vaults in the Android Files app, unlocked with biometric login" />
</figure>

Vaults can be hidden from the Files app by turning off **"Show vaults in the Files app"** in the settings.

### 💾 Save and Keep Going

When a file is saved from another app, Cryptomator uploads it in the background. If the file was changed in the cloud in the meantime, nothing gets overwritten. Cryptomator saves the local version as a separate **conflict copy** instead.

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/android-document-provider-save.png" srcset="/img/blog/android-document-provider-save.png 1x, /img/blog/android-document-provider-save@2x.png 2x" alt="Saving an edited spreadsheet back to a Cryptomator vault" />
</figure>

### 🔒 Smarter Auto-Lock

"Lock after" now counts from the last time the vault was used, including access from other apps. That way, a vault won't lock while a document is still being edited in another app. The new **"Wait for transfers"** setting (on by default) also keeps the vault unlocked until running uploads are finished. "Lock all" still locks everything immediately.

### ⚡ A Faster In-App Browser

The in-app browser isn't going anywhere. Vaults can still be browsed and managed right inside Cryptomator. The browser now uses the same cache as the Files app, so both always show the same state. Changes appear immediately, and upload progress shows right on each file. The in-app browser now shows image thumbnails, too.

## Get the Update

Cryptomator for Android 3.0.0 is rolling out now on Google Play, and it's also available from our website and F-Droid. As always, the update is free. Existing users just need to update the app. New to Cryptomator? The app is [free to download](/android/) and try out. The Document Provider is included in the free version as well, read-only just like the in-app browser.

We're curious to hear which apps and workflows Cryptomator vaults end up in. The best places to share those stories are our [Community forum](https://community.cryptomator.org/) and [Mastodon](https://mastodon.online/@cryptomator). And if something doesn't work as expected, we'd appreciate a report on [GitHub](https://github.com/cryptomator/android/issues).

Stay safe. Stay encrypted.

---

## Update: Apps That Can't Access or Unlock a Vault Yet

### Which Apps Work with Cryptomator?

In short: every app that opens and saves files through Android's own file picker. That's the screen that appears in many apps after tapping "Open" or "Save as", and it looks the same in every app. Each vault is listed there next to locations such as "Downloads". Nothing has to be set up in the app itself.

Apps that only show their own file list or gallery instead of this file picker can't see vaults. In that case, a file can still be opened from the Files app or from Cryptomator and handed over to the other app from there.

### Apps That Can't Unlock a Vault Yet

If a vault is locked when another app [asks for its files](https://developer.android.com/guide/topics/providers/document-provider), Cryptomator tells that app that the vault has to be unlocked first, using the mechanism Android provides for exactly this. The system Files app then shows an unlock button and carries on once the vault is unlocked. Many third-party file managers and editors don't support this yet: they only show an error and offer no way to unlock. Android [doesn't require apps to handle this case](https://developer.android.com/reference/android/provider/DocumentsProvider), so it's a missing feature rather than a bug in those apps.

Until those apps catch up, the vault has to be unlocked in Cryptomator before it's opened from such an app. After that, everything works as usual.

We're reaching out to the developers of these apps and asking them to add support. Know an app that can't access or unlock a vault? Let us know in a reply to our announcement on [Mastodon](https://mastodon.online/@cryptomator/117641997591859446), [Reddit](https://www.reddit.com/r/Cryptomator/comments/1y03y6n/the_document_provider_for_android_is_officially/), [LinkedIn](https://www.linkedin.com/posts/skymatic_cryptomator-for-android-300-encrypted-activity-7529092970919170048-EDNw), [Instagram](https://www.instagram.com/p/Df6mf1mihX1/), or [Facebook](https://facebook.com/reel/1703752294790585/), or in the [Community forum](https://community.cryptomator.org/t/the-document-provider-for-android-is-here/17817), so we can get in touch with its maintainers.

As a stopgap, an upcoming version of Cryptomator will show a notification whenever an app runs into a locked vault. A tap opens the unlock dialog on top of the current app, and afterwards the action just has to be repeated there. It's a workaround rather than a fix, since only the app itself can pick up where it left off.

### For App Developers: Handling a Locked Vault

A `DocumentsProvider` may throw [`android.app.AuthenticationRequiredException`](https://developer.android.com/reference/android/app/AuthenticationRequiredException) (API 26+, a subclass of `SecurityException`) from any `ContentResolver` or `DocumentsContract` call, such as `query`, `openInputStream`/`openFileDescriptor`, `createDocument`, `renameDocument`, or `deleteDocument`. Supporting it takes three steps:

1. Catch `AuthenticationRequiredException` around calls to document URIs.
2. Launch the [`PendingIntent`](https://developer.android.com/reference/android/app/PendingIntent) from its `getUserAction()` from an activity, using `startIntentSenderForResult` (or the [`StartIntentSenderForResult`](https://developer.android.com/reference/androidx/activity/result/contract/ActivityResultContracts.StartIntentSenderForResult) activity result contract).
3. On `RESULT_OK`, repeat the call that failed. On any other result, show the normal error.

It's best handled in one shared place rather than per screen, so that listing, viewing, copying, and saving all behave the same. It shouldn't be launched from background work such as thumbnails or silent refreshes. In a proof of concept for one file manager, the whole change came to about 170 lines. None of this is specific to Cryptomator: any [document provider](https://developer.android.com/guide/topics/providers/create-document-provider) with a lock or an expired sign-in can use the same signal.
