---
title: "Encrypt Cloud Storage: How Open Source Strengthens Security"
type: article
description: "Trust, but verify: If you want to encrypt your cloud storage, open source encryption software offers you even more protection."
aliases: ["/faq/security", "/faq/security/opensource", "/faq/security/audits"]

navtitle: "How Open Source Strengthens Security"
ctatitle: "You want to encrypt your cloud storage with Cryptomator?"
ctatext: "Cryptomator is free and can be used without an account. Just download and get started."
ctalink: /downloads/
ctabutton: "Encrypt Your Cloud Storage Now"

ogimage:
  relsrc: /img/open-source/bartender-vs-stranger@2x.png
  width: 1472
  height: 664
---

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

# Encrypt your data securely in the cloud: How you can further increase your data security through open source

<p class="lead">Maybe you've been looking into encrypting your cloud storage for a while now, and you've come across "open source" solutions. Maybe you're wondering why open source is so important if you want to encrypt your files? Here we explain it to you.</p>

To help you understand what open source actually means, let's start with an example.

Imagine you are in a foreign city. In the evening, you visit a part of town that is considered a bit shady. There, you go to a bar and want to have a drink.

Which of the following scenarios sounds safer to you:

{{< /markdownify >}}</div>

<table class="my-6">
  <tr>
    <td class="text-center">
      <div class="fa-stack flex-shrink-0 text-xl text-secondary">
        <i class="fas fa-circle fa-stack-2x"></i>
        <strong class="fa-stack-1x fa-inverse">1</strong>
      </div>
    </td>
    <td class="pl-3">
      <p class="text-sm md:text-base leading-relaxed text-gray-700">The bartender prepares your drink right in front of you.</p>
    </td>
  </tr>

  <tr>
    <td class="text-center py-6">
      <p class="text-sm md:text-base leading-relaxed text-gray-700">or</p>
    </td>
    <td></td>
  </tr>

  <tr>
    <td class="text-center">
      <div class="fa-stack flex-shrink-0 text-xl text-secondary">
        <i class="fas fa-circle fa-stack-2x"></i>
        <strong class="fa-stack-1x fa-inverse">2</strong>
      </div>
    </td>
    <td class="pl-3">
      <p class="text-sm md:text-base leading-relaxed text-gray-700">A stranger offers you some of his drink.</p>
    </td>
  </tr>
</table>

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

You probably already sense a tendency: The stranger may look nice – and in most cases there is certainly no reason for suspicion.

But you don't know: What if there is something in the drink that shouldn't be there?

And maybe the old saying comes to your mind: Trust, but verify.

<img class="inline-block" src="/img/open-source/bartender-vs-stranger.png" srcset="/img/open-source/bartender-vs-stranger.png 1x, /img/open-source/bartender-vs-stranger@2x.png 2x" alt="Bartender vs. Stranger" />

## Trust, but verify – especially if you want to encrypt sensitive data in the cloud {#trust-but-verify}

And it's exactly this advantage of verification that open source software offers you when you want to encrypt your cloud storage (such as Dropbox).

To come back to the example with the bar: In fact, it would even be possible for you to mix your own drink.

Because open source allows you to do just that: The instructions and all the ingredients are available. In addition, you even have the option of adapting and further improving the recipe if necessary.

## Exactly how open source software increases your data security {#advantages}

At first glance, you don't "see" the aspects of open source in the software itself. This is because the advantages lie in the security-related criteria for the development of the software.

Before we go any further, let's now briefly look at the following axiom of data encryption (cryptography):

The security of an encryption process must depend solely on the key and must not be based on the secrecy of the encryption algorithms. (The so-called {{< extlink "https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle" "Kerckhoff's principle" >}}.)

<figure class="text-center">
  <img class="inline-block rounded" src="/img/open-source/auguste-kerckhoffs.jpg" alt="Auguste Kerckhoffs" />
  <figcaption>Named after {{< extlink "https://en.wikipedia.org/wiki/Auguste_Kerckhoffs" "Auguste Kerckhoffs" >}} (1835 – 1903)</figcaption>
</figure>

Thus, since security depends only on the key, there is no disadvantage in publishing the algorithm.

At the same time, however, open source has many security-enhancing advantages:

{{< /markdownify >}}</div>

<div class="flex my-6">
  <div class="fa-stack flex-shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-users fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">The source code can be viewed by a community of programmers – from hobby programmers to security researchers – which directly detects unauthorized access.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-primary no-underline hover:underline" href="#" x-on:click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Learn more</a>
      <div x-show="isLearnMoreOpen" x-cloak class="rounded shadow bg-white mt-4">
        <div class="p-4">
          <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">Because anyone can view the source code, it prevents backdoors for governments, law enforcement agencies, or business partners from being built in unnoticed.</p>
          <p class="text-sm md:text-base leading-relaxed text-gray-700"><strong>So if someone unauthorized had access to your data, it would at least be noticed very quickly.</strong></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="flex my-6">
  <div class="fa-stack flex-shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-sync fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">The source code is constantly reviewed and thus continuously improved.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-primary no-underline hover:underline" href="#" x-on:click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Learn more</a>
      <div x-show="isLearnMoreOpen" x-cloak class="rounded shadow bg-white mt-4">
        <div class="p-4">
          <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">Apart from official audits, the source code is also used by third parties and is thus constantly checked.</p>
          <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">If vulnerabilities are found, they cannot be silently ignored. If there is ever a problem, it is quickly noticed and the provider of the encryption software is forced to react quickly. Both the cause and the remedy are publicly documented.</p>
          <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4"><strong>So you can rest assured that when you encrypt your cloud storage, the security is not just verified one-time intensively, but also on an ongoing basis by professionals.</strong></p>
          <p class="text-sm md:text-base leading-relaxed text-gray-700">History shows that in other cases (with so-called closed-source software) security vulnerabilities remained unfixed for years because the provider had no public pressure to react.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="flex mt-6 mb-12">
  <div class="fa-stack flex-shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-clouds fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">The source code is copied hundreds of times, which makes the encryption independent of the provider.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-primary no-underline hover:underline" href="#" x-on:click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Learn more</a>
      <div x-show="isLearnMoreOpen" x-cloak class="rounded shadow bg-white mt-4">
        <div class="p-4">
          <p class="text-sm md:text-base leading-relaxed text-gray-700 mb-4">Even if the encryption software provider eventually ceases operations, <strong>you will still have access to your encrypted data and can continue to encrypt your cloud storage.</strong></p>
          <p class="text-sm md:text-base leading-relaxed text-gray-700">This is because the source code is copied hundreds of times and can be legally re-published by others.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

## Encrypt cloud storage with open source software: On the safe side with Cryptomator {#robust-crypto}

Cryptomator is just such an open source encryption software. Thanks to its open source nature, maximum transparency is guaranteed. Thus, the security of your data is secured on many levels and constantly increased:

1. In addition to the actual code, quality metrics from automated tests as well as bug reports are publicly available.
2. The code is constantly adapted to the latest standards.
3. Feedback from the community is implemented immediately.
4. We use proven ciphers for encryption, the correct use of which has been audited several times and is also constantly verifiable.
5. It is impossible for us to hide security vulnerabilities for marketing or other reasons, because the entire code can be checked by the community at any time.

All this leads to an outstanding robustness of the cryptographic implementation, which has also been highlighted by auditors:

> The cryptographic implementation exhibited a quite exceptional level of robustness.

– {{< extlink "https://cryptomator.org/audits/2017-11-27%20crypto%20cure53.pdf" "Audit by Cure53" >}}

**In other words: This robustness increases your data security many times over when you encrypt your files in the cloud with open source software.**

With Cryptomator, we also put a focus on high user-friendliness. You can use [Dropbox](/encrypt-dropbox/), Google Drive, OneDrive, etc. as usual and at the same time know that all your sensitive data is safe.

{{< /markdownify >}}</div>
