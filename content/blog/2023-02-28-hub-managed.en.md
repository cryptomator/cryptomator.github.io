---
title: "Cryptomator Hub: Managed – Request Access Now"
slug: hub-managed
date: 2023-02-28
tags: [cryptomator, hub]

summary: We are happy to announce that managed instances of Cryptomator Hub are now available! And we released Hub 1.1.0 with recovery key support.
---
We are happy to announce that managed instances of [Cryptomator Hub](/hub/) are now available! :tada: And we have released Hub 1.1.0 with recovery key support.

## Request Access

First things first. :rocket: To get started, you can now [request access to a managed instance of Cryptomator Hub](/hub/managed/). After your request, we will get back to you as soon as possible. Currently, some of the steps we take internally to create a managed Hub instance are still done "manually". We are working on automating this process, but we didn't want to delay the release any longer.

## Managed vs. Self-Hosted

Managed instances of Cryptomator Hub are a great way to start using Cryptomator Hub right away without having to deploy and maintain your self-hosted instance.

Until now, you could _only_ use the self-hosted version of Hub. This requires a lot of knowledge about how to deploy a software container using Kubernetes or Docker Compose. And if you have the knowledge, you still have to maintain the instance yourself. This includes updating the software, monitoring the instance, and keeping it secure.

With managed instances, we will take care of deploying and maintaining your Hub instance, while ensuring that your instance is highly available. You can focus on your work and your team.

This is all possible because of the underlying [zero-knowledge key management](https://github.com/cryptomator/hub/wiki/Zero-Knowledge-Key-Management). Cryptomator Hub doesn't store unencrypted keys. All key material remains locally on the client. We can't decrypt your data. It also helps that Hub is independent of your cloud storage provider, which means we have no access to either the key material or the cloud files.

## Release 1.1.0: Recovery Key

We didn't stop there and released Cryptomator Hub 1.1.0 with recovery key support. This allows you to access your data in case of disaster. Not only that, the recovery key is compatible with Cryptomator's recovery key. This means you can convert your existing vaults to Hub vaults and vice versa.

What does that mean for your managed instance? If we cease to exist (we get asked this a lot, thanks to Boxcryptor :wink:), you can convert your Hub vaults to "regular" password-based vaults, completely offline, so that you _always_ have access to your data under any circumstances. This is also great for your self-hosted instance if something happens to your server.
