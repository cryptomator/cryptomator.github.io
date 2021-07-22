---
title: "Update on the Document Provider Development"
slug: android-document-provider
date: 2021-07-22
notice: Dieser Blog-Post ist nicht auf Deutsch verfügbar.
tags: [cryptomator, android]

summary: "From time to time, we need to adjust our schedule for certain features. We are well aware that the Document Provider is the most-requested feature of the Android app, but despite this fact, we need to temporarily shift our attention to other tasks within this project."
---
Hey Community,

From time to time, we need to adjust our schedule for certain features. We are well aware that the Document Provider is the most-requested feature of the Android app, but despite this fact, we need to temporarily shift our attention to other tasks within this project. This blog post you're reading right now is to keep you, our community, updated and inform you that we are unable to stick to our original plan. Unfortunately, this means that any further development of the Document Provider feature needs to be postponed to the end of this year.

## The Document Provider Feature
As users of our Android app, you know how cumbersome sometimes the work with it is: You open your favourite notes app to quickly jot something down, then notice that you cannot open your to-do list from the app because you store it encrypted with Cryptomator. So you sigh, open the Cryptomator app, unlock your vault, navigate to the to-do list file and open it with the aforementioned notes app. Definitely not the optimal workflow.

We always strive to provide the same features across all our supported platforms. One of these is a user-friendly integration of the vault into the running OS to easily access content of unlocked vaults. For the desktop systems, this feature was always present and recently we added it in our new iOS app. The last OS, where it is missing is Android. And the way to resolve this, is implementing a Document Provider for our Android app.

The Document Provider feature creates a virtual access point to an unlocked vault, with the consequence that you can conveniently browse and access a vault’s content via the standard file browser. Also, any app which supports browsing through Document Providers can directly load files from your unlocked vault without the need to go via Cryptomator’s app GUI.

## Development Status
The development is tracked in the following ticket of our issue tracker: https://github.com/cryptomator/android/issues/35

As you can see, the issue is already quite old and got over the time a countable amount of comments. After [publishing the source code](https://cryptomator.org/blog/2020/12/23/android-open-source/) of the app at the end of 2020, our plan was to work on this important feature.

From the technical side, we already determined the parts of code needed to be edited, developed a concept and built a proof of concept (see the linked ticket). The next step would be to actually implement it including rigorous testing.

Unfortunately, we determined that integrating Document Provider into the existing app would require major architectural changes, therefore requiring a lot of time and resources. We have exciting plans with Cryptomator after our next major release with version 1.6.0 so that we have to delay the development of the Document Provider integration to the end of 2021.

Meanwhile, maybe you, our community can help us out.

## Call for Contributions
Cryptomator for Desktop was always open source. Cryptomator for iOS and Android are now open source as well. And as such, we also rely on our community to receive feedback, distribute the app and improve its functionality.

So, we are always very excited about contributions and are happy to assist, especially when it comes to the Document Provider. :wink:
