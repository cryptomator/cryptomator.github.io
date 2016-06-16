---
layout: post
title:  "In-Depth: Export Compliance for French iOS App Store"
date:   2016-06-16
author: Tobias
notice: Aufgrund der technischen Natur dieses Blog-Beitrags, haben wir diesen nicht übersetzt. Viel Spaß beim Lesen!
tags: [cryptomator, in-depth, ios]
stylesheets: ['/css/blog-post.css']

published: true
language: de

sitemap: false
---
Cyptomator for iOS has finally been approved by the French administration. You can download it now in the <a href="https://itunes.apple.com/fr/app/cryptomator/id953086535" target="_blank">French App Store</a>. We'd like to share our experience on how to receive export compliance for the French iOS App Store.

Just to be clear, you also need the U.S. Encryption Registration (ERN) approval from the U.S. Bureau of Industry (BIS). But this has already been covered by many sites, just google for `export compliance ern ios app store`.

However, there is little information on how to get the French encryption declaration approval from the Agence nationale de la sécurité des systèmes d'information (ANSSI). This information could be useful for fellow developers that are e.g. using third-party libraries for cryptographic operations in their iOS app. I'm not sure if this is also needed for the Google Play Store (or other Android app stores). We'll see soon enough.

### When do you need French approval?
Let's take a look on how we've filled out our export compliance documentation in iTunes Connect, which is needed for apps containing encryption.

<table class="table">
  <tr>
    <th>ID</th>
    <th>Question</th>
    <th>Answer</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Is your app designed to use cryptography or does it contain or incorporate cryptography? (Select Yes even if your app is only utilizing the encryption available in iOS or OS X.)</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Does your app qualify for any of the exemptions provided in Category 5, Part 2 of the U.S. Export Administration Regulations?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Does your app implement one or more encryption algorithms that are proprietary or yet to be accepted as standard by international standard bodies (such as, the IEEE, IETF, ITU, and so on)?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>4</td>
    <td>Does your app implement one or more encryption algorithms instead of, or in addition to, accessing or using the encryption in iOS and OS X?</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Is your app going to be available on the French App Store?</td>
    <td>Yes</td>
  </tr>
</table>

Our answer to question 4 is probably less common among typical apps using encryption. Additionally to Apple's CommonCrypto, we're making use of OpenSSL and scrypt, which aren't bundled with the standard library of iOS. Only then you're going to be asked question 5 and only then you have to submit a copy of the French encryption declaration approval from the ANSSI.

### How do I submit an application to the ANSSI?
Thought you'd never ask. Thankfully, there is an English website for this: <a href="http://www.ssi.gouv.fr/en/regulation/cryptology/how-to-submit-an-application/" target="_blank">http://www.ssi.gouv.fr/en/regulation/cryptology/how-to-submit-an-application/</a>

But the fun stops there. From now on, everything is in French. Yup. That's right. Everything. Even the responses you receive are in French. And you have to submit your request via mail (yes, not email).

What's our advice on this? Best case you know someone who can read/write French, but in our case we just used Google Translate extensively. We've filled out the approval form in English, because we hoped for common sense that they're at least able to read our request in English. And it worked!

### How long does it take until my request has been processed/approved?
The official statement is:

> Declaration requests are processed within one month from receipt of the complete request file and authorisation requests within four months from the same date.

We've submitted our declaration request in the beginning of April 2016 and received a first response in the beginning of May. It was just to inform us that they've received our request and it'll take another two months to finish the process. In the end, we've received the approval two months after our submission.

I don't remember exactly how long it took to get the ERN approval, but it was just a matter of days and completely processed online.

### Summary
I hope you learned something from our experience and if you're an app developer struggling with the same issue, you hopefully received some insight in this process. Obviously, this information may change in the future, so do some additional research. :wink:

Funny story: In the approval form are checkboxes, which you can enable if you're sending a CD or USB flash drive with information of your product (like commercial brochure, user manual, technical details). I couldn't believe what they were asking for, so I didn't send anything besides the approval form. They kindly sent me an email, if I could provide a commercial or technical brochure for Cryptomator so that they can process my request. So I did that via email and everything was fine. :smile:
