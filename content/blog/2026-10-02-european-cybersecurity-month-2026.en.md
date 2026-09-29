---
title: "Who Protects Your Data in the Cloud?"
slug: european-cybersecurity-month-2026
date: 2026-10-02T00:00:00+02:00
tags: [cryptomator, hub]

summary: "Cybersecurity is a shared responsibility. Find out who plays which role in protecting your cloud data – and why client-side encryption matters so much."

ogimage:
  relsrc: /img/blog/european-cybersecurity-month-2026.png
  width: 1200
  height: 675
---

Every October, Europe turns its attention to cybersecurity. Through European Cybersecurity Month, the European Union Agency for Cybersecurity (ENISA), the European Commission, and numerous partners work to raise awareness of digital risks. The campaign's core message is as simple as it is far-reaching: **Cybersecurity is a Shared Responsibility.**

At first, that sounds obvious. After all, we don't use digital services in isolation: we work in teams, share files across cloud platforms, access documents from multiple devices, and rely on a wide range of technology providers. It follows that protecting our data can't depend on any single person or a single safeguard either.

But **shared responsibility carries a hidden risk**: if everyone is responsible, no one ends up feeling truly accountable. A cloud provider can thoroughly secure its servers and networks. An organization can put clear policies in place. Employees can handle passwords and sharing settings carefully. And yet one crucial question remains: **who can actually read the stored files?**

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/european-cybersecurity-month-2026.png" alt="European Cybersecurity Month 2026: Cybersecurity is a shared responsibility" />
</figure>

## Cybersecurity Is Everyone's Job

Cybersecurity is still often seen as **purely an IT department task**. After all, that's where people configure networks, update software, manage user accounts, and respond to security incidents. This technical expertise is indispensable – but it can't protect an organization on its own.

An accidentally misconfigured share, a convincingly worded phishing link, or a lost device is enough to bypass existing safeguards. At the same time, it would be too simplistic to label people as the "weakest link." **Users can only act securely if organizations give them understandable processes, adequate training, and tools that actually fit into everyday work.**

Cybersecurity is therefore built on several layers:

- **People** need to be able to recognize risks and act responsibly.
- **Organizations** need to define responsibilities, processes, and permissions.
- **Cloud providers** need to secure their infrastructure and services.
- **Technology vendors** need to build solutions that are secure and easy to understand.
- **Technical safeguards** need to account for mistakes and limit their impact.

Shared responsibility doesn't mean everyone has the same job. It means that **distinct responsibilities are clearly defined and complement each other in meaningful ways**.

## What Responsibility Do Users Carry?

Many cyberattacks don't start with a spectacular technical breakthrough but with an everyday action: someone clicks a link, enters credentials on a fake website, or shares a document with the wrong recipient. That's what makes **security awareness** such an important part of any protection strategy.

You do your part by:

- using strong, unique passwords,
- enabling multi-factor authentication,
- critically evaluating unexpected links, attachments, and requests,
- sharing files deliberately and as sparingly as possible,
- keeping software and operating systems up to date,
- not uploading sensitive data to the cloud unprotected,
- reporting suspicious activity or your own mistakes early.

That said, this responsibility has limits. **No one detects every deception**, reviews every technical configuration, or assesses every risk on their own. Anyone who tries to achieve security through vigilance alone is underestimating the risk of human error.

Therefore, a sound security plan does not assume that people will do everything right. It makes sure that **a single mistake doesn't lead to serious consequences**.

## What Responsibility Do Organizations Carry?

Companies, universities, research institutions, NGOs, and other organizations need to create the conditions that make secure work possible in the first place. That takes more than an **annual awareness training session**.

Organizations should first understand what data they process and how sensitive it is. A publicly available presentation needs different safeguards than HR records, research data, draft contracts, [works council documents](/blog/2025/11/24/encryption-for-works-councils/), or information about at-risk individuals.

Building on that, clear rules are needed – above all for the moments when something changes:

- How are new team members onboarded?
- What happens when someone leaves the organization or a project?
- How are personal devices and external partners handled?
- What happens if a device is lost or stolen?

The **principle of least privilege** is especially important here: people should only be able to access the information they actually need for their work. Access and sharing permissions also need regular review – **a permission granted once should never remain in place indefinitely.**

**Choosing the right tools** is just as much part of an organization's responsibility. A security solution that makes workflows unnecessarily complicated gets bypassed in everyday use. Good security combines an appropriate level of protection with usability that fits into existing processes.

## What Does a Cloud Provider Protect – and What Doesn't It Protect?

Cloud services let teams collaborate from anywhere, sync files, and keep information available across devices. Professional providers invest heavily in securing their infrastructure: **data centers, networks, platforms, and the availability of their services**.

That doesn't answer every security and privacy question, though. The provider secures the infrastructure, while the organization remains responsible for **user accounts, permissions, sharing settings, and the choice of what data gets uploaded** in the first place. Even a technically well-protected cloud storage system can't prevent an authorized person from accidentally sharing too much information, or sensitive files from being stored without an additional layer of protection.

This is where an important distinction helps:

**Cloud security protects the service. Encryption protects the content of the files.**

The two belong together. Encryption doesn't replace secure user accounts or reliable cloud infrastructure. Conversely, a well-protected account doesn't replace the encryption of particularly sensitive content.

## Who Holds the Key?

Many cloud services transmit data in encrypted form. That matters, because it protects information from being intercepted on its way between a device and the server. Data is often also stored encrypted on the provider's servers.

What matters most, though, is **who controls the corresponding keys**. If a service can decrypt files back for you, then technically there's also a way to access that content. Depending on the service, this may even be necessary – for example, to generate previews, edit documents in the browser, or search through content.

For a lot of everyday information, this model is perfectly sufficient. But for **particularly confidential data**, you want to be sure that only the intended group of people can decrypt the content. That's exactly where **client-side encryption** comes in.

## Client-Side Encryption: Protection Before Upload

With client-side encryption, files are **encrypted on the device itself before they're uploaded to the cloud**. Only encrypted file contents ever reach cloud storage – without the right key, they remain unreadable.

This creates an additional layer of security that works **regardless of which storage provider you choose**. You don't have to hand your cloud provider control over unencrypted file contents: synchronization, availability, and collaboration all stay intact, while control over decryption stays with you.

That limits the impact of typical risk scenarios:

- Cloud files become exposed due to a **misconfiguration**.
- **Unauthorized parties** gain access to cloud storage.
- An external service provider holds **extensive infrastructure privileges**.
- Data is retained on servers or in **backups longer than expected**.
- An organization wants to reduce its **dependence on a single provider's security promises**.

Here, too, one caveat applies: encryption is not a substitute for a complete security concept. An already-unlocked device, a compromised key, or an unauthorized person with legitimate access all remain a risk. **Encryption doesn't solve every problem – but it ensures that the protection of file contents doesn't depend solely on cloud infrastructure and user accounts.**

## Shared Responsibility Requires Individual Control

The shared-responsibility principle works best when **every party involved can actually control their own area**. For the confidentiality of cloud files, that means control belongs with the people and organizations the data belongs to.

Client-side encryption makes exactly that separation possible. The cloud provider stores and syncs the files, while authorized parties retain control over their readable content. That's how an abstract idea of shared responsibility becomes a **concrete division of labor** – provided the tools for it are accessible, reliable, and **don't require anyone to become an encryption expert**. That's exactly the role Cryptomator plays.

## How Cryptomator Protects Your Cloud Files

Cryptomator makes **client-side encryption** for cloud files accessible to everyone. You create an encrypted **vault** and store the files you want to protect inside it. **Your files are encrypted on your device before they reach the cloud** – consistently following the **zero-knowledge principle**: only you know your vault password, and the keys never leave your devices.

Which storage service you use is entirely up to you: **Dropbox, Google Drive, OneDrive, iCloud, or any other provider.** Cryptomator isn't tied to any single cloud service – it adds an extra layer of encryption on top of the sync solution you already have. And because Cryptomator is **open source**, anyone can transparently verify how the application works.

For individuals, that means storing personal documents, financial records, or private photos in the cloud without giving your storage provider insight into the unencrypted content. Cryptomator is [free to download](/downloads/) and takes just minutes to set up.

## How Cryptomator Hub Supports Organizations

Once multiple people start working with encrypted data together, additional requirements come into play. Access needs to be managed, responsibilities need to be defined, and team changes need to be accounted for. That's exactly where **Cryptomator Hub** comes in.

Hub centrally organizes access to encrypted vaults **without weakening the security model**. Instead of passing a vault password around the team, access is tied to **verifiable identities and clear permissions**: Hub signs users in through its built-in **Keycloak**, which connects to existing identity providers such as **Microsoft Entra ID** via **OpenID Connect** or **SAML**, or syncs users from **LDAP** and **Active Directory**. Hub follows the **zero-knowledge principle** too – encryption and decryption happen exclusively on users' devices, and the Hub server never sees plaintext data. We covered why shared passwords hit their limits in teams in more detail in our [World Password Day post](/blog/2026/05/07/world-password-day-2026/).

This is relevant, for example, when:

- researchers collaborate on confidential project data,
- an NGO exchanges sensitive information across multiple locations,
- a works council stores particularly confidential documents,
- a company shares documents with a clearly defined project team,
- external contributors need access only for a limited period of time.

Organizations keep using their existing cloud infrastructure while ensuring that sensitive file content can only be decrypted by authorized people. **Data protection doesn't become a separate workflow – it becomes part of how the team already works.** The [Cryptomator Hub product page](/hub/) gives you an overview – or [request a demo directly](/contact-sales/).

## Awareness Is the Starting Point – Implementation Is What Counts

Every year, European Cybersecurity Month reminds us to take digital risks seriously. **But awareness alone doesn't protect a single file.** What matters is what you do with that awareness.

Use October as your prompt: enable multi-factor authentication, review your existing cloud shares, or start encrypting confidential files before you upload them.

Organizations can use October to systematically review their responsibilities:

1. What sensitive data do we store in the cloud?
2. Who currently has access to that data?
3. Are roles and responsibilities documented?
4. Are access rights reviewed regularly?
5. What safeguards kick in if an account is compromised?
6. Are particularly confidential files already encrypted before upload?
7. Can employees actually use the intended security tools without friction in everyday work?

Simply answering these questions together surfaces gaps and sparks concrete improvements.

## Conclusion

Cybersecurity isn't a single product, nor a task that can be fully delegated to the IT department, a cloud provider, or users. It emerges wherever **people, processes, and technology work together effectively** – and where every party knows what they contribute and which safeguards no one else will provide on their behalf.

**Client-side encryption adds a crucial layer to that interplay**: sensitive files are already protected before they ever reach the cloud.

Responsibility can be shared. **Control over your data is still something you should keep for yourself.**

[Download Cryptomator for free](/downloads/) or [learn more about Cryptomator Hub for teams](/hub/).

*All through October, our mobile apps and the Supporter Certificate are 33% off — [all the details are in our Halloween Sale post](/blog/2026/10/01/halloween-sale-2026/).*

---

**Further reading:** [European Cybersecurity Month at ENISA](https://www.enisa.europa.eu/topics/cyber-hygiene/european-cybersecurity-month)
