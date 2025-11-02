---
title: "Cryptomator Desktop 1.18.0 Beta – Try it now!"
slug: desktop-beta-1.18.0
date: 2025-09-26
tags: [cryptomator, desktop, beta]

summary: "The 1.18.0 beta of Cryptomator Desktop is here: new features, key fixes, and a new Windows installer certificate that needs your support. Try it now and share your feedback!"

ogimage:
  relsrc: /img/blog/desktop-1.18.0-beta.png
  width: 1200
  height: 675
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/desktop-1.18.0-beta.png" alt="Cryptomator Desktop 1.18.0 Beta" />
</figure>

The next release of Cryptomator Desktop is right around the corner – and before we publish the final version, we'd like to invite you to test the beta of version 1.18.0. Along with useful new features and important bug fixes, this release also comes with a special call to our community.

## New Features & Fixes

With Cryptomator Desktop 1.18.0, we’re once again bringing improvements and bug fixes across all platforms:

#### New Feature

- Remember Last Vault Location  
  When creating a new vault, Cryptomator will now automatically suggest the last chosen storage location. This makes setup more convenient, especially if you manage multiple vaults in similar folder structures.

#### Fixes

- Linux/KDE: QuickAccess Entries  
  On KDE, each unlock process created a new QuickAccess entry in the Dolphin file manager, even if one already existed (e.g., after an unexpected app crash). This is now fixed – existing entries are reused, and no manual cleanup is needed.
- Prevention of Huge Log Files  
  On Windows, log files could in rare cases grow extremely large, causing system issues. The existing size limit of log files was bypassed in those cases. This has been fixed, so the app can safely run in the background without issues.
- macOS: Stability When Saving Vault Passwords  
  Some users experienced app crashes when trying to save a vault password. This bug has now been fixed, so password saving on macOS works reliably.
- macOS: macFUSE Detection on macOS 26  
  In the upcoming macOS version 26, macFUSE was sometimes not detected, leading to problems when mounting vaults. This issue is fixed to ensure Cryptomator works smoothly on the latest macOS releases.

<div class="text-center">
  <a href="https://github.com/cryptomator/cryptomator/releases/tag/1.18.0-beta1/"><i class="fa-solid fa-download"></i> Download the Beta 1.18.0 here</a>
</div>

## We Need Your Support!

In addition to these updates, there’s something special this time:  
Our Windows installer is now signed with a new certificate. Since this certificate is not yet widely recognized in Microsoft’s trust network, Windows may display a security prompt when installing the beta version.

The more people install the beta, the faster the certificate will gain trust – and the security dialog will disappear. Don’t worry: the installer is still safe and signed by us. Windows just needs to “learn” that the new certificate is trustworthy.

## Final Words

With version 1.18.0, we’re making Cryptomator more convenient, stable, and future-proof. The beta is an important step – not only to test the new features and fixes, but also to establish our new certificate in the Windows ecosystem.

We’re grateful for every bit of support from the community:

- Install the beta and try out the updates.
- Share your feedback if you notice anything.
- Help us make the final release as stable and user-friendly as possible.

Your feedback makes Cryptomator stronger – and ensures we can all keep our data securely encrypted.

Thank you for your support – we can’t wait for the final release of 1.18.0! 🎉
