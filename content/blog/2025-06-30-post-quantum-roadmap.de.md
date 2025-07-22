---
title: "Unser Fahrplan zur Post-Quanten-Kryptografie"
slug: post-quantum-cryptography
date: 2025-06-30
tags: [cryptomator, encryption]
params:
  math: true
  fediverseCreator: "@overheadhunter@mastodon.social"
  Author: "Sebastian Stenzel"
  Authorimg: "https://static.cryptomator.org/photos/team/sebastian-512.jpg"
#  Authorlink: "https://mastodon.social/@overheadhunter" ?

summary: "Quantencomputer werden viele traditionelle Verschlüsselungsverfahren brechen. Erfahre, wie wir Cryptomator Hub anpassen wollen, um Angreifern einen Schritt voraus zu sein."

ogimage:
  relsrc: /img/blog/cryptobot-xwing-bg.png
  width: 1480
  height: 832
---

Wenn du dies liest, hast du wahrscheinlich schon von Quantencomputern gehört und davon, dass sie möglicherweise einige traditionelle Verschlüsselungsverfahren brechen könnten. In diesem Artikel zeigen wir auf, wie sich dies auf Cryptomator auswirkt und was unser Plan ist, um vollständig quantensicher zu werden.

## Kryptografische Aufschlüsselung

Werfen wir zunächst einen Blick auf die in Cryptomator verwendeten Verschlüsselungsverfahren:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/traditional-cipher-breakdown.svg" alt="Diagramm, das das Wachstum von 2^n im Vergleich zu n^2 zeigt" />
  <figcaption>Kryptografische Aufschlüsselung von Cryptomator & Hub</figcaption>
</figure>

Wie du sehen kannst, verlassen wir uns hauptsächlich auf AES- und EC-basierte Algorithmen. Dies sind traditionelle Algorithmen, deren Sicherheitsannahmen in einer Welt klassischer (nicht-quantenbasierter) Computer gelten. Die Grundidee ist, dass Berechnungen effizient sind, wenn man den richtigen Schlüssel kennt, aber ohne ihn praktisch unmöglich. Wenn ich "praktisch unmöglich" sage, meine ich auf traditionellen Computern, da die Berechnungen einfach "zu komplex" sind.

## Ein paar Worte zur Komplexität

Während wir Komplexität vermeiden, wenn es um Benutzerfreundlichkeit oder Code-Lesbarkeit geht, gibt es eine bestimmte Art von Komplexität, die wir anstreben. Lass mich das erklären:

Wenn wir ausdrücken wollen, wie viele Schritte eine bestimmte Berechnung erfordert, kategorisieren wir Algorithmen in Klassen von Rechenkomplexität. Zur Veranschaulichung hier einige hundebezogene Beispiele:

| Komplexitätsklasse | Beispiel                                                                                                                                                      | Big-O    |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Konstante Zeit     | Das Pfeifen mit einer Hundepfeife dauert immer gleich lang, unabhängig davon, wie viele Hunde zuhören.                                                      | O(1)     |
| Logarithmische Zeit| Die Telefonnummer einer Tierklinik im Telefonbuch zu finden ist einfach, da es alphabetisch sortiert ist und man die Seiten schnell eingrenzen kann.        | O(log n) |
| Lineare Zeit       | Jeden Hund streicheln. Wenn jeder Hund die gleiche Aufmerksamkeit bekommt, dauert es bei n Hunden genau n-mal so lange.                                     | O(n)     |
| Polynomielle Zeit  | Wenn jeder Hund auf einer Party jeden anderen Hund beschnuppern und begrüßen will. Hund 1 schnuppert Hund 2, 3, 4, ... Hund 2 schnuppert Hund 3, 4, ... usw.| O(nᵏ)    |
| Exponentielle Zeit | Jeder Hund hat 4 Welpen. Das ergibt 16 Hunde nach zwei Generationen, 64 nach drei Generationen und 256 nach vier Generationen.                              | O(kⁿ)    |

Um sicherzustellen, dass das Brechen einer Verschlüsselung eine wahnsinnige Menge an Zeit und Energie erfordert, beruhen kryptografische Algorithmen auf schwer zu berechnenden Problemen - d.h. wir bewegen uns auf der komplexeren Seite des Spektrums.

Das anschaulichste Beispiel dafür ist das Faktorisierungsproblem: Bestimme die Primfaktoren von 8633. Das Ergebnis ist durch eine einfache Multiplikation (89 × 97) leicht zu überprüfen, aber die Faktoren aus dem Produkt zu finden ist schwer; [schwerer als polynomial, aber subexponentiell](https://en.wikipedia.org/wiki/General_number_field_sieve). Genau darauf basiert das RSA-Krypto-Schema (allerdings mit einigen *sehr* großen Zahlen), wobei der öffentliche Schlüssel das Produkt zweier geheimer Primzahlen enthält, die zur Berechnung des privaten Schlüssels erforderlich sind.

## Wie Quantencomputer Verschlüsselungen schwächen

### Asymmetrische Kryptografie

Quantencomputer sind nicht von Natur aus schneller, aber sie ermöglichen die Ausführung einer anderen Art von Algorithmen. Ein Problem, das für traditionelle Algorithmen schwer zu berechnen ist, könnte also weit weniger komplex sein, wenn es mit Quantenalgorithmen gelöst wird.

Eines der berüchtigtsten Beispiele ist [Shors Algorithmus](https://de.wikipedia.org/wiki/Shor-Algorithmus), der das Faktorisierungsproblem in polynomieller Zeit löst. Während polynomielle Zeit nur eine Zeile über der exponentiellen Zeit in der obigen Tabelle liegt, macht es den entscheidenden Unterschied. Die folgende Grafik veranschaulicht die Auswirkung einer zunehmenden Problemgröße auf die beiden Komplexitätsklassen:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-complexity-classes.svg" alt="Diagramm, das das Wachstum von 2^n im Vergleich zu n^2 zeigt" />
  <figcaption>Wachstumskurven von polynomiellen und exponentiellen Funktionen</figcaption>
</figure>

Wenn ein Quantencomputer gebaut werden kann, der in der Lage ist, Shors Algorithmus auf große Zahlen anzuwenden, würde er die meisten der heutigen Public-Key-Kryptografie brechen – einschließlich ECDH.

### Symmetrische Kryptografie

Stell dir ein Zahlenschloss mit vier Ziffern vor. Um die richtige Kombination zu erraten, müsste ein traditioneller Computer jede Möglichkeit überprüfen, beginnend mit 0000 und endend mit 9999. Im Durchschnitt würde es 5.000 Versuche dauern. Was aber, wenn ich dir sage, dass ein Quantencomputer es in nur 100 Versuchen schaffen könnte? Klingt wie Magie? Das ist genau das, was Grovers Algorithmus erreichen kann.

Allgemeiner gesagt: Wenn ein traditioneller Algorithmus im Durchschnitt \(n/2\) Schritte benötigt, braucht ein Quantencomputer nur \(\sqrt n\) Versuche – eine Beschleunigung, die das BBBV-Theorem als die bestmögliche Lösung beweist. Wenn du verstehen möchtest, wie das funktioniert, gibt es [ein großartiges Video von 3Blue1Brown über Grovers Algorithmus](https://www.youtube.com/watch?v=RQWpF2Gb-gU).

Diese "Magie" gilt für jedes Problem, bei dem es effizient ist zu überprüfen, ob eine geratene Lösung korrekt ist. Das ist offensichtlich ein Problem, wenn du nicht möchtest, dass ein Angreifer deinen geheimen Schlüssel errät. Glücklicherweise ist die Verteidigung einfach: Erhöhe \(n\) auf eine Größe, bei der selbst \(\sqrt n\) groß genug wird, um Grovers Algorithmus unpraktisch zu machen.

> [!QUESTION] Warum ist AES-256 quantensicher?
> Hast du dich schon einmal gefragt, warum wir AES-256 anstelle von AES-128 verwenden?
> 
> Die "256" bezieht sich auf die Anzahl der Schlüsselbits, was zu \(2^{256}\) möglichen Schlüsseln führt. Das Erraten des richtigen Schlüssels würde daher \(2^{256} / 2 = 2^{255}\) Versuche auf einem traditionellen Computer und \(\sqrt{2^{256}} = 2^{128}\) Versuche mit Grovers Algorithmus erfordern.
>
> \(2^{128}\) Versuche durchzuführen ist einfach nicht machbar. Während AES-128 also auf traditionellen Computern ausreicht, erfordert die Post-Quanten-Welt AES-256.

## Eine neue Ära der Verschlüsselungsverfahren

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-crystals.webp, /img/blog/cryptobot-crystals@2x.webp 2x" src="/img/blog/cryptobot-crystals.webp" alt="Cryptobot trägt Jedi-Roben und lässt einen Kyber-Kristall und einen Dilithium-Kristall mit der Macht schweben" />
  <figcaption>Kyber und Dilithium</figcaption>
</figure>

Während also ein ausreichend großer Schlüsselraum für AES genügt, müssen unsere asymmetrischen Verschlüsselungsverfahren ersetzt werden, um Angriffen von Quantencomputern standzuhalten. Im Jahr 2016 startete das National Institute of Standards and Technology (NIST) einen Wettbewerb zur Identifizierung quantenresistenter kryptografischer Algorithmen.

Die Wahl von Algorithmen durch einen Wettbewerb hat sich bereits in der Vergangenheit bewährt, wie bei AES und SHA-3. Dieser Ansatz zieht erhebliche Aufmerksamkeit von Experten auf sich, die ihr Bestes tun, um Schwachstellen aufzudecken.

Im Jahr 2022, nach mehreren Runden der Eliminierung von Dutzenden von Kandidaten, [verkündete NIST die Gewinner](https://www.nist.gov/news-events/news/2022/07/nist-announces-first-four-quantum-resistant-cryptographic-algorithms). Kyber und Dilithium – benannt nach Kristallen aus Star Wars bzw. Star Trek – wurden die ersten standardisierten Post-Quanten-Algorithmen für Verschlüsselung und digitale Signaturen. Sie wurden offiziell ML-KEM und ML-DSA genannt.

> [!TIP]
> Auch hier gibt es ein [großartiges Video, das die zugrunde liegende Mathematik der ML-basierten Kryptografie erklärt](https://www.youtube.com/watch?v=K026C5YaB3A).

Großartig! Lasst uns also ML-KEM und ML-DSA in Cryptomator Hub integrieren:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-cipher-breakdown.svg" alt="Diagramm, das das Wachstum von 2^n im Vergleich zu n^2 zeigt" />
  <figcaption>Cryptomator Hub mit Post-Quanten-Kryptografie</figcaption>
</figure>

"Aber warte, da ist immer noch ECDH drin!?" höre ich dich sagen. Und du hast recht. Trotz der vielversprechenden neuen Verschlüsselungsverfahren müssen wir uns der Tatsache stellen, dass sie einfach noch nicht lange existieren. Wir wissen noch nicht, welche Arten von Angriffen in Zukunft entdeckt werden könnten – oder ob diese Algorithmen wirklich den Test der Zeit bestehen werden.

Um also besonders vorsichtig zu sein, kombinieren wir ein traditionelles Verschlüsselungsverfahren mit einem Post-Quanten-Verfahren. Denk daran wie an eine Tür mit zwei Schlössern: Wenn eines gebrochen ist, schützt das andere immer noch das, was sich dahinter befindet. Es ist ein einfaches Design, das sicherstellt, dass das System nicht schwächer ist als seine einzelnen Komponenten. Dieser Post-Quanten/traditionelle (PQ/T) Hybrid wird *X-Wing* genannt.

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-xwing.webp, /img/blog/cryptobot-xwing@2x.webp 2x" src="/img/blog/cryptobot-xwing.webp" alt="Cryptobot sitzt im Droidensockel eines X-Wing-Jägers und hat großen Spaß beim Flug durch den Weltraum" />
  <figcaption>Cryptomator wird X-Wing verwenden</figcaption>
</figure>

X-Wing ist noch in Arbeit, aber ich habe mich an die RFC-Autoren – Deirdre Connolly, Peter Schwabe und Bas Westerbaan – gewandt, um zu fragen, wann wir mit der Veröffentlichung der endgültigen Spezifikation rechnen können. Nur zehn Minuten später antwortete Bas:

> [!QUOTE]
> „X-Wing ist final und wird vermutlich von Google und Apple in Hardware ausgeliefert."
>
> \- Bas Westerbaan

Um sicher zu gehen, fragte ich nach und wollte wissen, ob sie weitere Änderungen am aktuellen RFC-Entwurf erwarten – was sie nicht tun:

> [!QUOTE]
> „Keine signifikanten Änderungen, keine Änderungen geplant oder erwartet"
>
> \- Deirdre Connolly

Dies bestätigte unsere Überzeugung, dass jetzt der perfekte Zeitpunkt ist, um mit der Einführung von X-Wing als zukünftigen Standard für die Schlüsselkapselung zu beginnen.

> [!QUESTION] Wenn PQ/T-Hybride vorzuziehen sind, was ist dann mit einem hybriden Signaturschema?
> Ja, es gibt auch [Bemühungen, eine Kombination aus ML-DSA und ECDSA zu standardisieren](https://datatracker.ietf.org/doc/draft-prabel-jose-pq-composite-sigs/02/). Im Gegensatz zu X-Wing befindet sich dies jedoch in einer früheren Phase. Wir verfolgen die Entwicklungen in diesem Bereich genau und werden dieses Schema wahrscheinlich nutzen, sobald es bereit ist.

## Standardisierung der Kryptografie

### Vorteile der Standardisierung

In jeder Branche spielt die Standardisierung eine Schlüsselrolle. Sie stellt Kompatibilität sicher, fördert die Interoperabilität und reduziert Kosten, indem sie es verschiedenen Systemen und Organisationen ermöglicht, mit gemeinsamen Protokollen und Spezifikationen zusammenzuarbeiten – und dabei Konsistenz und Zuverlässigkeit zu gewährleisten.

Im Sicherheitsbereich ist Standardisierung noch wichtiger. Algorithmen, Protokolle und Datenformate müssen nicht nur zuverlässig über heterogene Systeme hinweg funktionieren – sie müssen auch einer rigorosen Prüfung standhalten. Je mehr Experten einen Standard begutachten, desto besser. Wie bei den bereits erwähnten NIST-Wettbewerben kann eine solche Prüfung Schwachstellen aufdecken, *bevor* ein Verschlüsselungsverfahren produktiv eingesetzt wird. Durch die Einhaltung etablierter, transparenter Standards profitieren sowohl Entwickler als auch Benutzer von stärkerem, vertrauenswürdigerem Schutz – besonders da sich die Bedrohungslandschaft mit Technologien wie Quantencomputing weiterentwickelt.

Solche Standards zu ignorieren – manchmal im Namen von Geschwindigkeit oder Bequemlichkeit – führt dich auf einen Weg, der mit versteckten Fehlern gepflastert sein kann. Selbst die kleinste Änderung kann ernsthafte Schwachstellen einführen, die ohne gründliche Peer-Reviews wahrscheinlich zuerst von jemandem entdeckt werden, der klüger und weniger wohlgesinnt ist.

Bei Cryptomator haben wir uns immer gegen "Sicherheit durch Verschleierung" ausgesprochen (weshalb auch [Open Source wichtig ist](https://cryptomator.org/de/guides/open-source/)). Unnötig zu sagen, dass wir nie selbstgebraute Verschlüsselungsverfahren verwendet haben – das würde ein ernsthaftes Risiko darstellen. Und je weiter verbreitet ein Algorithmus oder Protokoll ist, desto einfacher wird es, das System als Ganzes zu verstehen, zu verifizieren und zu auditieren.

### Ein starkes Fundament

Viele Standards bauen auf anderen auf. Ohne ML-KEM gäbe es kein X-Wing. Jetzt, da X-Wing vor der Tür steht, was können wir damit tun? Es in einem weiteren Standard verwenden: [HPKE](https://www.rfc-editor.org/rfc/rfc9180.html).

HPKE steht für Hybrid Public Key Encryption – und um genau zu sein, hängt es überhaupt nicht von X-Wing ab. Stattdessen definiert es, wie man drei verschiedene kryptografische Zutaten – KEM, KDF und AEAD – auf eine bestimmte Weise kombiniert, die gut definierte Sicherheitseigenschaften gewährleistet. Und X-Wing kann als eine dieser Zutaten (das KEM) dienen.

Ein weiterer Standard, den wir lieben gelernt haben, ist JWE, ein Datenformat für den Austausch verschlüsselter Nutzdaten. Und weißt du was – es gibt Leute, die daran arbeiten, [die Verwendung von X-Wing-basiertem HPKE in JWE zu standardisieren](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07). Das ist genau das, was wir in Cryptomator Hub übernehmen wollen, um die aktuellen ECDH-basierten JWEs zu ersetzen.

Über die bereits erwähnten Vorteile von Peer-Reviews hinaus bietet die Übernahme standardisierter Formate gegenüber proprietären mehrere zusätzliche Vorteile:

- Gemeinsame APIs erleichtern den Austausch von Implementierungen – zum Beispiel bleibt die HPKE-Nutzung unabhängig von den zugrunde liegenden Algorithmen gleich
- Breite Verfügbarkeit von gut etablierten Bibliotheken. Zum Beispiel gibt es Dutzende von JWE/JWT-Bibliotheken
- Offizielle Testvektoren ermöglichen es uns, Tests zu schreiben, die den Build frühzeitig fehlschlagen lassen, wenn etwas schief geht
- Schnelleres Bewusstsein für Schwachstellen: Wenn ein Fehler in einem weit verbreiteten Standard entdeckt wird, wird er wahrscheinlich schnell gemeldet – während eine einzelne proprietäre Implementierung viel länger unbemerkt bleiben kann.

Sowohl JWE als auch HPKE unterstützen austauschbare interne Algorithmen bei gleichzeitiger Beibehaltung einer konsistenten externen Schnittstelle. Dies ermöglicht es uns, die Gesamtstruktur beizubehalten und interne Komponenten schnell zu ersetzen, wenn Schwachstellen auftreten.

> [!QUOTE]
> Die Moral von der Geschichte ist die Notwendigkeit kryptografischer Agilität. Es reicht nicht aus, einen einzelnen Standard zu implementieren; es ist von entscheidender Bedeutung, dass unsere Systeme in der Lage sind, bei Bedarf leicht neue Algorithmen einzutauschen.
>
> — [Bruce Schneier](https://www.schneier.com/blog/archives/2022/08/nists-post-quantum-cryptography-standards.html)

### Standardisierung des Tresorformats

Wenn also alle in Cryptomator-Produkten verwendeten Verschlüsselungsverfahren – sowie der Austausch von Geheimnissen in Cryptomator Hub – auf Standards basieren, was ist dann mit dem Tresorformat?

Während wir gut etablierte Kryptografie verwenden, sind die Dateiformate selbst unsere eigenen. Aber wir wollen das ändern. Vor einiger Zeit haben wir uns mit Entwicklern von Cyberduck, gocryptfs und rclone zusammengetan, um ein gemeinsames Format für verschlüsselte Verzeichnisse abzuleiten – um die Interoperabilität zwischen unseren Tools sicherzustellen. Obwohl das Format noch in Arbeit ist, hoffen wir, in ein paar Monaten weitere Details mit euch teilen zu können. In der Zwischenzeit seid ihr natürlich eingeladen, das Format zu überprüfen und Ideen zur Verbesserung auf [GitHub](https://github.com/encryption-alliance/unified-vault-format) beizutragen.

Ein wichtiger Vorteil dieses *Unified Vault Format* ist, dass es Schlüsselrotation ermöglicht – was selbst zwei große Vorteile bringt:

1. **Zugriffswiderruf**: Nach der Rotation von Schlüsseln können ehemalige Tresormitglieder keine Dateien mehr entschlüsseln, die nach dem Widerruf ihres Zugriffs hinzugefügt wurden. Was mit Zugriffskontrolllisten trivial ist, erfordert besondere Sorgfalt, wenn wir dies kryptografisch durchsetzen wollen.
2. **Verschlüsselungsagilität**: Bis zu einem gewissen Grad ermöglicht es Verschlüsselungs-Upgrades. Wenn beispielsweise eine Schwachstelle in einem Algorithmus gefunden wird, können wir einen Schalter umlegen und zu einem neuen JWE-Algorithmus übergehen – wodurch alle neu hinzugefügten Dateien sofort geschützt werden.

## Kurz gesagt: Wo stehen wir?

### Cryptomator

Wie oben erklärt, ist Cryptomator bereits quantensicher. Da es nur symmetrische Verschlüsselungsverfahren mit ausreichend großen Schlüsselräumen verwendet, stellen Quantencomputer derzeit keine bekannte Bedrohung dar.

### Cryptomator Hub

Wir sind derzeit dabei, X-Wing und HPKE-7 in JWE-Bibliotheken zu implementieren. Als 100% Open-Source-Unternehmen haben wir schon immer zu anderen Bibliotheken und Projekten beigetragen. So überrascht es nicht, dass wir jetzt in engem Kontakt mit den Betreuern einer der am weitesten verbreiteten [JOSE-Bibliotheken für Java](https://connect2id.com/products/nimbus-jose-jwt), den Autoren von [JOSE HPKE RFC](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07) und dem [X-Wing RFC](https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/) sowie dem JDK-Sicherheitsteam stehen und diese neuen Standards zu Upstream-Projekten wie [X-Wing-Unterstützung im OpenJDK](https://github.com/openjdk/jdk/pull/26032) beitragen. Alles, um gemeinsam eine widerstandsfähige Grundlage für die kommenden Jahre zu schaffen.