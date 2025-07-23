---
title: "Our Roadmap to Post-Quantum Cryptography"
slug: post-quantum-roadmap
date: 2025-07-24
author: "Sebastian Stenzel"
authorlink: "https://mastodon.social/@overheadhunter"
authorimg: "https://static.cryptomator.org/photos/team/sebastian-512.jpg"
fediversecreator: "@overheadhunter@mastodon.social"
tags: [cryptomator, encryption]

summary: "Quantum computers will break many traditional ciphers. Learn how we plan to adjust Cryptomator Hub in order to stay ahead of attackers."

ogimage:
  relsrc: /img/blog/cryptobot-xwing-bg.png
  width: 1480
  height: 832

math: true

# Remove the following when publishing
publishDate: 2025-07-22
disableComments: true
build:
  list: never
---

If you're reading this, chances are you've heard about quantum computers and how they may eventually break some traditional ciphers. In this article, we outline how this affects Cryptomator and what our plan is to become fully quantum-secure. 

## Cryptographic Breakdown

First, let's take a look at the ciphers involved in Cryptomator:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/traditional-cipher-breakdown.svg" alt="Plot showing the growth of 2^n compared to n^2" />
  <figcaption>Cryptographic Breakdown of Cryptomator & Cryptomator Hub</figcaption>
</figure>

As you can see, we mostly rely on AES- and EC-based algorithms. These are traditional algorithms whose security assumptions apply in a world of classical (non-quantum) computers. The general idea is that computations are efficient if you know the right key but practically impossible without. When I say "practically impossible" I mean on traditional computers, as the computations are just "too complex".

## A Few Words About Complexity

While we aim to avoid complexity when it comes to usability or code legibility, there is a specific kind of complexity that we strive for. Let me explain:

When we want to express how many steps a certain computation requires, we categorize algorithms into classes of computational complexity. To illustrate this concept, here are some dog-related examples:

| Complexity Class | Example                                                                                                                                                | Big O    |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Constant Time    | Blowing the dog whistle always takes the same time, regardless of how many dogs are listening.                                                         | O(1)     |
| Logarithmic Time | Finding the phone number of a pet clinic is easy with a telephone book, as it's sorted alphabetically and allows you to quickly narrow down the pages. | O(log n) |
| Linear Time      | Petting every dog. If every dog gets the same attention, it takes exactly n times longer, if you have n dogs.                                          | O(n)     |
| Polynomial Time  | If every dog at a party wants to sniff and greet every other dog. Dog 1 sniffs dog 2, 3, 4, ... Dog 2 sniffs dog 3, 4, ... and so on.                  | O(nᵏ)    |
| Exponential Time | Every dog has 4 puppies. That makes 16 dogs after two generations, 64 after three generations and 256 after four generations.                          | O(kⁿ)    |

To ensure that breaking a cipher requires an insane amount of time and energy, cryptographic algorithms rely on hard-to-compute problems—i.e., we're operating on the more complex side of the spectrum.

The most illustrative example for this is the factorization problem: Determine the prime factors of 8633. The result is easy to verify through a simple multiplication (89 × 97), but finding the factors from the product is hard; [harder than polynomial but subexponential](https://en.wikipedia.org/wiki/General_number_field_sieve). This is exactly what the RSA crypto scheme is based on (except with some *very* large numbers), where the public key includes the product of two secret primes that are required to compute the private key.

## How Quantum Computers Weaken Ciphers

### Asymmetric Cryptography

Quantum computers are not inherently faster, but they allow for a different set of algorithms to run. So, while a problem may be hard-to-compute for traditional algorithms, it could be far less complex when solved with quantum algorithms.

One of the most infamous examples is [Shor's algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm), which solves the factorization problem in polynomial time. While polynomial time is just one row above exponential time in the table above, it makes all the difference. The following graph illustrates the effect of an increasing problem size on the two complexity classes:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-complexity-classes.svg" alt="Plot showing the growth of 2^n compared to n^2" />
  <figcaption>Growth curves of polynomial and exponential functions</figcaption>
</figure>

If a quantum computer can be built that is capable of running Shor's algorithm on large numbers, it would break most of today's public-key cryptography—including ECDH.

### Symmetric Cryptography

Imagine a number lock with four digits. To guess the correct combination, a traditional computer would have to check every possibility, starting with 0000 and ending with 9999. On average, it would take 5,000 guesses. Now, what if I told you that a quantum computer could do it in just 100 guesses? Sounds like magic? That is exactly what Grover's algorithm can achieve. 

More generally, when a traditional algorithm takes \(n/2\) steps on average, a quantum computer only needs \(\sqrt n\) attempts—a speed-up that the BBBV theorem proves to be the best possible solution. If you want to understand how this works, there's [a great video by 3Blue1Brown about Grover's Algorithm](https://www.youtube.com/watch?v=RQWpF2Gb-gU).

This "magic" applies to any problem where it's efficient to check if a guessed solution is correct. That's obviously a problem if you don't want an attacker to guess your secret key. Fortunately, the defense is simple: increase \(n\) to a size where even \(\sqrt n\) becomes large enough to make Grover's algorithm impractical.

> [!QUESTION] Why is AES-256 quantum-secure?
> Ever wondered why we use AES-256 instead of AES-128?
> 
> The "256" refers to the number of key bits, resulting in \(2^{256}\) possible keys. Guessing the correct key would therefore take \(2^{256} / 2 = 2^{255}\) attempts on a traditional computer and \(\sqrt{2^{256}} = 2^{128}\) attempts using Grover's algorithm.
>
> Making \(2^{128}\) guesses is simply unfeasible. So, while AES-128 suffices on traditional computers, the post-quantum world demands for AES-256.

## A New Era of Ciphers

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-crystals.webp, /img/blog/cryptobot-crystals@2x.webp 2x" src="/img/blog/cryptobot-crystals.webp" alt="Cryptobot wearing Jedi robes and levitating a Kyber crystal and a Dilithium crystal using the force" />
  <figcaption>Kyber and Dilithium</figcaption>
</figure>

So, while a sufficiently large key space is enough for AES, our asymmetric ciphers need to be replaced to withstand attacks from quantum computers. In 2016, the National Institute of Standards and Technology (NIST) launched a competition to identify quantum-resistant cryptographic algorithms. 

Electing algorithms through a competition has already proven successful in the past, as with AES and SHA-3. This approach attracts significant attention from experts, who do their best to uncover weaknesses.

In 2022, after several rounds of eliminating dozens of candidates, NIST [announced the winners](https://www.nist.gov/news-events/news/2022/07/nist-announces-first-four-quantum-resistant-cryptographic-algorithms). Kyber and Dilithium—named after crystals from Star Wars and Star Trek, respectively—became the first standardized post-quantum algorithms for encryption and digital signatures. They were officially named ML-KEM and ML-DSA.

> [!TIP]
> Again, here is a [great video explaining the underlying math of ML-based cryptography](https://www.youtube.com/watch?v=K026C5YaB3A).

Great! So let's integrate ML-KEM and ML-DSA into Cryptomator Hub:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-cipher-breakdown.svg" alt="Plot showing the growth of 2^n compared to n^2" />
  <figcaption>Cryptomator Hub with Post-Quantum Cryptography</figcaption>
</figure>

"But wait, there is still ECDH in it!?" I hear you say. And you're right. Despite the new ciphers being very promising, we have to face the fact that they simply haven't been around for long. We just don't know yet what kinds of attacks might be discovered in the future—or whether these algorithms will truly stand the test of time.

So, to be extra cautious, we combine a traditional cipher and a post-quantum one. Think of it like a door with two locks: if one is broken, the other still protects what's inside. It's a simple design that ensures the system is no weaker than its individual components. This post-quantum/traditional (PQ/T) hybrid is called *X-Wing*.

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-xwing.webp, /img/blog/cryptobot-xwing@2x.webp 2x" src="/img/blog/cryptobot-xwing.webp" alt="Cryptobot sitting in the droid socket of an X-Wing fighter, having great fun flying through space" />
  <figcaption>Cryptomator will use X-Wing</figcaption>
</figure>

X-Wing is still a work in progress, but I reached out to the RFC authors—Deirdre Connolly, Peter Schwabe, and Bas Westerbaan—to ask when we can expect the final specification to be published. Just ten minutes later, Bas replied:

> [!QUOTE]
> X-Wing is final and being shipped by Google and Apple presumably in hardware.
>
> — Bas Westerbaan

To be sure, I followed up and asked whether they expect any further changes to the current RFC draft—which they don't:

> [!QUOTE]
> No significant changes, no changes planned or expected at all.
>
> — Deirdre Connolly

This confirmed our belief that now is the perfect time to begin adopting X-Wing as the future standard for key encapsulation.

> [!QUESTION] If PQ/T hybrids are preferable, what about a hybrid signature scheme?
> Yes, there are also [efforts to standardize a combination of ML-DSA and ECDSA](https://datatracker.ietf.org/doc/draft-prabel-jose-pq-composite-sigs/02/). Other than X-Wing, this is in an earlier phase, though. We are closely following developments in this area and will probably make use of this scheme once it is ready.

## Standardizing Cryptography

### Benefits of Standardization

In every industry, standardization plays a key role. It ensures compatibility, promotes interoperability, and reduces costs by enabling different systems and organizations to work together using common protocols and specifications—maintaining consistency and reliability.

In the security sector, standardization is even more critical. Algorithms, protocols, and data formats must not only function reliably across heterogeneous systems—they must also withstand rigorous scrutiny. The more experts peer review a standard, the better. As with the NIST competitions mentioned earlier, such scrutiny can uncover weaknesses *before* a cipher is deployed in production. By adhering to established, transparent standards, both developers and users benefit from stronger, more trustworthy protection—especially as the threat landscape evolves with technologies like quantum computing.

Ignoring such standards—sometimes in the name of speed or convenience—sets you on a path that may be paved with hidden flaws. Even the smallest change can introduce serious vulnerabilities that, without thorough peer reviews, are likely to be discovered first by someone smarter and less well-intentioned.

At Cryptomator, we've always stood against "security through obscurity" (which is also [why open source matters](/guides/open-source/)). Needless to say, we've never used home-cooked ciphers—that would pose a serious risk. And the more widely used an algorithm or protocol is, the easier it becomes to understand, verify, and audit the system as a whole.

### A Strong Foundation

Many standards are built upon others. Without ML-KEM, there would be no X-Wing. Now that X-Wing is around the corner, what can we do with it? Use it in yet another standard: [HPKE](https://www.rfc-editor.org/rfc/rfc9180.html).

HPKE stands for Hybrid Public Key Encryption—and to be precise, it doesn't depend on X-Wing at all. Instead, it defines how to combine three different cryptographic ingredients—KEM, KDF, and AEAD—in a specific way that ensures well-defined security properties. And X-Wing can serve as one of these ingredients (the KEM).

Another standard that we've come to love is JWE, a data format for exchanging encrypted payloads. And guess what—there are people working on [standardizing the use of X-Wing-based HPKE in JWE](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07). That's exactly what we want to adopt in Cryptomator Hub, replacing the current ECDH-based JWEs.

Beyond the aforementioned benefits of peer reviews, adopting standardized formats over proprietary ones provides several additional advantages:

- Common APIs make it easy to swap out implementations—for example, HPKE usage remains the same regardless of the underlying algorithms.
- Wide availability of well-established libraries. For instance, there are dozens of JWE/JWT libraries.
- Official test vectors allows us to write tests that fail the build early if something goes wrong.
- Faster vulnerabilities awareness: If a flaw is discovered in a widely used standard, it will likely be reported quickly—whereas a single proprietary implementation may go unnoticed for much longer.

Both JWE and HPKE support interchangeable internal algorithms while maintaining a consistent external interface. This allows us to retain the overall structure and quickly replace internal components if vulnerabilities arise.

> [!QUOTE]
> The moral is the need for cryptographic agility. It’s not enough to implement a single standard; it’s vital that our systems be able to easily swap in new algorithms when required.
>
> — [Bruce Schneier](https://www.schneier.com/blog/archives/2022/08/nists-post-quantum-cryptography-standards.html)

### Standardizing the Vault Format

So, if all the ciphers used in Cryptomator products—as well as the exchange of secrets in Cryptomator Hub—are based on standards, what about the vault format?

While we use well-established cryptography, the file formats themselves are our own. But we want to change that. Some time ago, we joined forces with developers of Cyberduck, gocryptfs, and rclone to derive a common format for encrypted directories—ensuring interoperability across our tools. Although the format is still a work in progress, we hope to share more details with you in a couple of months. In the meantime, you're of course invited to review the format and contribute ideas for improvement on [GitHub](https://github.com/encryption-alliance/unified-vault-format).

One key benefit of this *Unified Vault Format* is that it enables key rotation—which itself brings two major advantages:

1. **Access revocation**: After rotating keys, former vault members can no longer decrypt files added after their access got revoked. What is trivial with access control lists requires special care when we want to enforce this cryptographically.
2. **Cipher agility**: To some extent, it enables cipher upgrades. For example, if a vulnerability is found in one algorithm, we can flip a switch and transition to a new JWE algorithm—instantly protecting all newly added files.

## In Short: Where Do We Stand?

### Cryptomator

As explained above, Cryptomator is already quantum-secure. Since it uses only symmetric ciphers with sufficiently large key spaces, quantum computers currently pose no known threat.

### Cryptomator Hub

We are currently in the process of implementing X-Wing and HPKE-7 in JWE libraries. As a 100% open-source company, we have always contributed to other libraries and projects. So it comes as no surprise that we are now in close contact with the maintainers of one of the most widely used [JOSE libraries for Java](https://connect2id.com/products/nimbus-jose-jwt), the authors of [JOSE HPKE RFC](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07) and the [X-Wing RFC](https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/) as well as the JDK security team, contributing these new standard to upstream projects such as [X-Wing support in the OpenJDK](https://github.com/openjdk/jdk/pull/26032). All to collaboratively build a resilient foundation for the years ahead.