---
title: "Unser Fahrplan zur Post-Quanten-Kryptografie"
slug: post-quantum-roadmap
date: 2025-07-24
author: "Sebastian Stenzel"
authorlink: "https://mastodon.social/@overheadhunter"
authorimg: "https://static.cryptomator.org/photos/team/sebastian-512.jpg"
fediversecreator: "@overheadhunter@mastodon.social"
tags: [cryptomator, encryption]

summary: "Quantencomputer werden viele traditionelle Verschlüsselungsverfahren brechen. Erfahre, wie wir Cryptomator Hub anpassen wollen, um Angreifern einen Schritt voraus zu sein."

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

Wenn du dies liest, hast du wahrscheinlich schon von Quantencomputern gehört und davon, dass sie möglicherweise einige traditionelle Verschlüsselungsverfahren brechen könnten. In diesem Artikel zeigen wir auf, wie sich dies auf Cryptomator auswirkt und was unser Plan ist, um vollständig quantensicher zu werden.

## Kryptografischer Breakdown

Werfen wir zunächst einen Blick auf die in Cryptomator verwendeten Verschlüsselungsverfahren:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/traditional-cipher-breakdown.svg" alt="Diagramm, das das Wachstum von 2^n im Vergleich zu n^2 zeigt" />
  <figcaption>Kryptografischer Breakdown von Cryptomator & Hub</figcaption>
</figure>

Wie du sehen kannst, verlassen wir uns hauptsächlich auf AES- und EC-basierte Algorithmen. Dies sind traditionelle Algorithmen, deren Sicherheitsannahmen in einer Welt klassischer (nicht-quantenbasierter) Computer gelten. Die Grundidee ist, dass Berechnungen effizient sind, wenn man den richtigen Schlüssel kennt, aber ohne ihn praktisch unmöglich. Wenn ich „praktisch unmöglich“ sage, meine ich auf traditionellen Computern, da die Berechnungen einfach „zu komplex“ sind.

## Ein paar Worte zur Komplexität

Während wir Komplexität vermeiden, wenn es um Benutzerfreundlichkeit oder Code-Lesbarkeit geht, gibt es eine bestimmte Art von Komplexität, die wir anstreben. Lass mich das erklären:

Wenn wir ausdrücken wollen, wie viele Schritte eine bestimmte Berechnung erfordert, kategorisieren wir Algorithmen in Klassen von Rechenkomplexität. Zur Veranschaulichung hier einige hundebezogene Beispiele:

| Komplexitätsklasse | Beispiel                                                                                                                                                      | Big-O    |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Konstante Zeit      | Eine Hundepfeife zu nutzen, dauert immer gleich lang, egal wie viele Hunde zuhören.                                                                                          | O(1)       |
| Logarithmische Zeit | Die Telefonnummer einer Tierklinik im Telefonbuch zu finden ist einfach, da es alphabetisch sortiert ist und man die Seiten schnell eingrenzen kann.                         | O(log n)   |
| Lineare Zeit        | Jeden Hund streicheln. Wenn jeder Hund gleich viel Aufmerksamkeit bekommt, dauert es genau n-mal so lange, wenn du n Hunde hast.                                             | O(n)       |
| Polynomielle Zeit   | Wenn jeder Hund auf einer Party jeden anderen Hund beschnuppern und begrüßen will. Hund 1 schnuppert an Hund 2, 3, 4, ... Hund 2 schnuppert an Hund 3, 4, ... und so weiter. | O(nᵏ)      |
| Exponentielle Zeit  | Jeder Hund bekommt 4 Welpen. Das ergibt 16 Hunde nach zwei Generationen, 64 nach drei und 256 nach vier Generationen.                                                        | O(kⁿ)      |

Um sicherzustellen, dass das Knacken eines Verschlüsselungsverfahrens extrem viel Zeit und Energie benötigt, beruhen kryptografische Algorithmen auf schwer berechenbaren Problemen – wir bewegen uns also auf der komplexeren Seite des Spektrums.

Das bekannteste Beispiel ist das Faktorisierungsproblem: Bestimme die Primfaktoren von 8633. Die Lösung ist einfach zu überprüfen (89 × 97), aber die Faktoren aus dem Produkt zu ermitteln, ist sehr schwer – [schwerer als polynomial, aber subexponentiell](https://en.wikipedia.org/wiki/General_number_field_sieve). Genau darauf basiert das RSA-Verschlüsselungsverfahren (nur mit viel größeren Zahlen), wobei der öffentliche Schlüssel das Produkt zweier geheimer Primzahlen enthält, die zur Berechnung des privaten Schlüssels erforderlich sind.

## Wie Quantencomputer Verschlüsselungen schwächen

### Asymmetrische Kryptografie

Quantencomputer sind nicht grundsätzlich schneller, aber sie ermöglichen eine andere Klasse von Algorithmen. Ein Problem, das auf klassischen Computern als komplex gilt, kann auf einem Quantencomputer deutlich einfacher sein.

Ein besonders bekanntes Beispiel ist der [Shor-Algorithmus](https://de.wikipedia.org/wiki/Shor-Algorithmus), der das Faktorisierungsproblem in polynomialer Zeit löst. Auch wenn polynomiale Zeit nur eine Zeile über exponentieller Zeit in der obigen Tabelle steht, macht das einen gewaltigen Unterschied. Die folgende Grafik veranschaulicht die Auswirkung einer zunehmenden Problemgröße auf die beiden Komplexitätsklassen:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-complexity-classes.svg" alt="Diagramm, das das Wachstum von 2^n im Vergleich zu n^2 zeigt" />
  <figcaption>Wachstumskurven von polynomiellen und exponentiellen Funktionen</figcaption>
</figure>

Wenn ein Quantencomputer gebaut werden kann, der Shors Algorithmus auf große Zahlen anwendet, würde das die meisten heute verwendeten Public-Key-Verfahren – einschließlich ECDH – brechen.

### Symmetrische Kryptografie

Stell dir ein Zahlenschloss mit vier Ziffern vor. Um die richtige Kombination zu erraten, müsste ein herkömmlicher Computer jede Möglichkeit überprüfen, beginnend mit 0000 und endend mit 9999. Im Durchschnitt würde dies 5.000 Versuche erfordern. Was wäre, wenn ich dir sagen würde, dass ein Quantencomputer dies mit nur 100 Versuchen schaffen könnte? Klingt wie Zauberei? Genau das kann der Grover-Algorithmus leisten. 

Allgemeiner gesagt: Wenn ein herkömmlicher Algorithmus durchschnittlich \(n/2\) Schritte benötigt, braucht ein Quantencomputer nur \(\sqrt n\) Versuche – eine Beschleunigung, die laut dem BBBV-Theorem die bestmögliche Lösung ist. Wenn du verstehen möchtest, wie das funktioniert, gibt es [ein großartiges Video von 3Blue1Brown über Grovers Algorithmus](https://www.youtube.com/watch?v=RQWpF2Gb-gU).

Diese „Magie" gilt für jedes Problem, bei dem es effizient ist, zu überprüfen, ob eine vermutete Lösung richtig ist. Das ist natürlich ein Problem, wenn du nicht möchtest, dass ein Angreifer deinen geheimen Schlüssel errät. Glücklicherweise ist die Abwehr einfach: Erhöhe \(n\) auf eine Größe, bei der selbst \(\sqrt n\) groß genug wird, um Grovers Algorithmus unpraktikabel zu machen.

> [!QUESTION] Warum ist AES-256 quantensicher?
> Hast du dich jemals gefragt, warum wir AES-256 anstelle von AES-128 verwenden?
> 
> Die „256” bezieht sich auf die Anzahl der Schlüsselbits, was zu \(2^{256}\) möglichen Schlüsseln führt. Das Erraten des richtigen Schlüssels würde daher \(2^{256} / 2 = 2^{255}\) Versuche auf einem herkömmlichen Computer und \(\sqrt{2^{256}} = 2^{128}\) Versuche mit Grovers Algorithmus erfordern.
> 
> \(2^{128}\) Versuche sind schlichtweg nicht machbar. Während AES-128 auf herkömmlichen Computern ausreicht, erfordert die Post-Quanten-Welt AES-256.

## Eine neue Ära der Verschlüsselung

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-crystals.webp, /img/blog/cryptobot-crystals@2x.webp 2x" src="/img/blog/cryptobot-crystals.webp" alt="Cryptobot trägt Jedi-Roben und lässt einen Kyber-Kristall und einen Dilithium-Kristall mit der Macht schweben" />
  <figcaption>Kyber und Dilithium</figcaption>
</figure>

Während für AES ein ausreichend großer Schlüsselraum ausreicht, müssen unsere asymmetrischen Verschlüsselungsverfahren ersetzt werden, um Angriffen durch Quantencomputer standhalten zu können. Im Jahr 2016 startete das National Institute of Standards and Technology (NIST) einen Wettbewerb zur Ermittlung quantenresistenter kryptografischer Algorithmen. 

Die Auswahl von Algorithmen im Rahmen eines Wettbewerbs hat sich bereits in der Vergangenheit bewährt, wie beispielsweise bei AES und SHA-3. Dieser Ansatz stößt bei Experten auf großes Interesse, die ihr Bestes geben, um Schwachstellen aufzudecken.

Im Jahr 2022, nach mehreren Runden, in denen Dutzende von Kandidaten ausgeschieden waren, gab das NIST [die Gewinner bekannt](https://www.nist.gov/news-events/news/2022/07/nist-announces-first-four-quantum-resistant-cryptographic-algorithms). Kyber und Dilithium – benannt nach Kristallen aus Star Wars bzw. Star Trek – wurden die ersten standardisierten Post-Quanten-Algorithmen für Verschlüsselung und digitale Signaturen. Sie erhielten offiziell die Namen ML-KEM und ML-DSA.

> [!TIP]
> Hier ist noch einmal ein [tolles Video, das die zugrunde liegende Mathematik der ML-basierten Kryptografie erklärt](https://www.youtube.com/watch?v=K026C5YaB3A).

Großartig! Integrieren wir also ML-KEM und ML-DSA in Cryptomator Hub:

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/pqc-cipher-breakdown.svg" alt="Diagramm der kryptografischen Architektur mit Post-Quanten-Verschlüsselung" />
  <figcaption>Cryptomator Hub mit Post-Quanten-Kryptografie</figcaption>
</figure>

„Aber Moment mal, da ist doch noch ECDH drin!?", höre ich dich sagen. Und du hast recht. Obwohl die neuen Verschlüsselungsalgorithmen sehr vielversprechend sind, müssen wir uns der Tatsache stellen, dass es sie einfach noch nicht lange gibt. Wir wissen einfach noch nicht, welche Arten von Angriffen in Zukunft entdeckt werden könnten – oder ob diese Algorithmen wirklich den Test der Zeit bestehen werden.

Um besonders vorsichtig zu sein, kombinieren wir daher eine traditionelle Verschlüsselung mit einer post-quantenbasierten. Stell dir das wie eine Tür mit zwei Schlössern vor: Wenn eines aufgebrochen wird, schützt das andere weiterhin den Inhalt. Es ist ein einfaches Design, das sicherstellt, dass das System nicht schwächer ist als seine einzelnen Komponenten. Diese Post-Quanten-/Traditionelle (PQ/T)-Hybridverschlüsselung wird *X-Wing* genannt.

<figure class="text-center">
  <img class="inline-block rounded-sm" srcset="/img/blog/cryptobot-xwing.webp, /img/blog/cryptobot-xwing@2x.webp 2x" src="/img/blog/cryptobot-xwing.webp" alt="Cryptobot sitzt im Droidensockel eines X-Wing-Jägers und hat großen Spaß beim Flug durch den Weltraum" />
  <figcaption>Cryptomator wird X-Wing verwenden</figcaption>
</figure>

X-Wing befindet sich noch in Entwicklung. Ich habe die RFC-Autoren – Deirdre Connolly, Peter Schwabe und Bas Westerbaan – gefragt, wann die finale Spezifikation veröffentlicht wird. Zehn Minuten später kam folgende Antwort von Bas:

> [!QUOTE]
> X-Wing ist final und wird vermutlich bereits von Google und Apple in Hardware ausgeliefert.
>
> — Bas Westerbaan

Zur Sicherheit fragte ich noch, ob Änderungen an der aktuellen Spezifikation geplant seien:

> [!QUOTE]
> Keine signifikanten Änderungen, nichts geplant oder erwartet.
>
> — Deirdre Connolly

Dies bestätigte unsere Überzeugung, dass jetzt der perfekte Zeitpunkt ist, um X-Wing als zukünftigen Standard für die Schlüsselkapselung einzuführen.

> [!QUESTION] Wenn PQ/T-Hybride vorzuziehen sind, was ist dann mit einem hybriden Signaturschema?
> Ja, es gibt auch [Bemühungen, eine Kombination aus ML-DSA und ECDSA zu standardisieren](https://datatracker.ietf.org/doc/draft-prabel-jose-pq-composite-sigs/02/). Im Gegensatz zu X-Wing befindet sich dies jedoch in einer früheren Phase. Wir verfolgen die Entwicklungen in diesem Bereich genau und werden dieses Schema wahrscheinlich nutzen, sobald es bereit ist.

## Standardisierung der Kryptografie

### Warum Standards wichtig sind

In jeder Branche spielt Standardisierung eine wichtige Rolle. Sie gewährleistet Kompatibilität, fördert Interoperabilität und senkt Kosten, indem sie es verschiedenen Systemen und Organisationen ermöglicht, mithilfe gemeinsamer Protokolle und Spezifikationen zusammenzuarbeiten – und dabei Konsistenz und Zuverlässigkeit zu gewährleisten.

Im Sicherheitsbereich ist Standardisierung sogar noch wichtiger. Algorithmen, Protokolle und Datenformate müssen nicht nur über heterogene Systeme hinweg zuverlässig funktionieren, sondern auch strengen Prüfungen standhalten. Je mehr Experten einen Standard begutachten, desto besser. Wie bei den zuvor erwähnten NIST-Wettbewerben können solche Prüfungen Schwachstellen aufdecken, bevor eine Verschlüsselung in der Produktion eingesetzt wird. Durch die Einhaltung etablierter, transparenter Standards profitieren sowohl Entwickler als auch Anwender von einem stärkeren, vertrauenswürdigeren Schutz – insbesondere angesichts der sich mit Technologien wie Quantencomputern weiterentwickelnden Bedrohungslandschaft.

Das Ignorieren solcher Standards – manchmal im Namen der Geschwindigkeit oder Bequemlichkeit – führt dich auf einen Weg, der mit versteckten Mängeln gepflastert sein kann. Selbst die kleinste Änderung kann schwerwiegende Schwachstellen mit sich bringen, die ohne gründliche Peer-Reviews wahrscheinlich zuerst von jemandem entdeckt werden, der klüger ist und weniger gute Absichten hat.

Bei Cryptomator haben wir uns immer gegen „Sicherheit durch Verschleierung” ausgesprochen (was auch der Grund ist, [warum Open Source so wichtig ist](/de/guides/open-source/)). Selbstverständlich haben wir nie selbst entwickelte Verschlüsselungen verwendet – das würde ein ernstes Risiko darstellen. Und je weiter verbreitet ein Algorithmus oder Protokoll ist, desto einfacher wird es, das System als Ganzes zu verstehen, zu überprüfen und zu auditieren.

### Ein starkes Fundament

Viele Standards bauen auf anderen auf. Ohne ML-KEM gäbe es kein X-Wing. Nun, da X-Wing kurz vor der Einführung steht, was können wir damit machen? Es in einem weiteren Standard verwenden: [HPKE](https://www.rfc-editor.org/rfc/rfc9180.html).

HPKE steht für Hybrid Public Key Encryption – und um genau zu sein, hängt es überhaupt nicht von X-Wing ab. Stattdessen definiert es, wie drei verschiedene kryptografische Komponenten – KEM, KDF und AEAD – auf eine bestimmte Weise kombiniert werden, um klar definierte Sicherheitseigenschaften zu gewährleisten. Und X-Wing kann als eine dieser Komponenten (KEM) dienen.

Ein weiterer Standard, den wir schätzen gelernt haben, ist JWE, ein Datenformat für den Austausch verschlüsselter Nutzdaten. Und weißt du was? Es gibt Leute, die daran arbeiten, [die Verwendung von X-Wing-basiertem HPKE in JWE zu standardisieren](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07). Genau das wollen wir in Cryptomator Hub übernehmen und damit die aktuellen ECDH-basierten JWEs ersetzen.

Über die oben genannten Vorteile von Peer-Reviews hinaus bietet die Verwendung standardisierter Formate gegenüber proprietären Formaten mehrere zusätzliche Vorteile:

- Gemeinsame APIs erleichtern den Austausch von Implementierungen – beispielsweise bleibt die Verwendung von HPKE unabhängig von den zugrunde liegenden Algorithmen gleich.
- Breite Verfügbarkeit etablierter Bibliotheken. So gibt es beispielsweise Dutzende von JWE/JWT-Bibliotheken.
- Offizielle Testvektoren ermöglichen es uns, Tests zu schreiben, die den Build frühzeitig abbrechen, wenn etwas schief geht.
- Schnellere Erkennung von Schwachstellen: Wenn ein Fehler in einem weit verbreiteten Standard entdeckt wird, wird er wahrscheinlich schnell gemeldet – während eine einzelne proprietäre Implementierung möglicherweise viel länger unbemerkt bleibt.

Sowohl JWE als auch HPKE unterstützen austauschbare interne Algorithmen bei gleichbleibender externer Schnittstelle. Dies ermöglicht es uns, die Gesamtstruktur beizubehalten und interne Komponenten schnell zu ersetzen, wenn Schwachstellen auftreten.

> [!QUOTE]
> Die Moral von der Geschichte ist die Notwendigkeit kryptografischer Agilität. Es reicht nicht aus, einen einzigen Standard zu implementieren; es ist entscheidend, dass unsere Systeme bei Bedarf problemlos neue Algorithmen einbinden können.
>
> — [Bruce Schneier](https://www.schneier.com/blog/archives/2022/08/nists-post-quantum-cryptography-standards.html)

## Standardisierung des Tresorformats

Wenn also alle in Cryptomator-Produkten verwendeten Verschlüsselungsalgorithmen – sowie der Austausch von Geheimnissen im Cryptomator Hub – auf Standards basieren, wie sieht es dann mit dem Tresorformat aus?

Wir verwenden zwar bewährte Kryptografie, aber die Dateiformate selbst sind unsere eigenen. Das möchten wir jedoch ändern. Vor einiger Zeit haben wir uns mit den Entwicklern von Cyberduck, gocryptfs und rclone zusammengetan, um ein gemeinsames Format für verschlüsselte Verzeichnisse zu entwickeln und so die Interoperabilität unserer Tools sicherzustellen. Das Format befindet sich zwar noch in der Entwicklung, aber wir hoffen, euch in ein paar Monaten weitere Details mitteilen zu können. In der Zwischenzeit seid ihr natürlich herzlich eingeladen, das Format zu überprüfen und Verbesserungsvorschläge auf [GitHub](https://github.com/encryption-alliance/unified-vault-format) einzureichen.

Ein wesentlicher Vorteil dieses *Unified Vault Format* ist, dass es eine Schlüsselrotation ermöglicht, was wiederum zwei wesentliche Vorteile mit sich bringt:

1. **Zugriffssperre**: Nach der Rotation der Schlüssel können ehemalige Mitglieder des Tresors keine Dateien mehr entschlüsseln, die nach dem Widerruf ihres Zugriffs hinzugefügt wurden. Was bei Zugriffskontrolllisten trivial ist, erfordert besondere Sorgfalt, wenn wir dies kryptografisch durchsetzen wollen.
2. **Flexibilität bei der Verschlüsselung**: Bis zu einem gewissen Grad ermöglicht es Verschlüsselungs-Upgrades. Wenn beispielsweise eine Schwachstelle in einem Algorithmus gefunden wird, können wir einen Schalter umlegen und zu einem neuen JWE-Algorithmus übergehen – wodurch alle neu hinzugefügten Dateien sofort geschützt sind.

## Kurz gesagt: Wo stehen wir?

### Cryptomator

Wie oben erläutert, ist Cryptomator bereits quantensicher. Da es ausschließlich symmetrische Verschlüsselungsalgorithmen mit ausreichend großen Schlüsselräumen verwendet, stellen Quantencomputer derzeit keine bekannte Bedrohung dar.

### Cryptomator Hub

Wir sind derzeit dabei, X-Wing und HPKE-7 in JWE-Bibliotheken zu implementieren. Als 100 %iges Open-Source-Unternehmen haben wir schon immer zu anderen Bibliotheken und Projekten beigetragen. Daher ist es nicht verwunderlich, dass wir nun in engem Kontakt mit den Betreuern einer der am weitesten verbreiteten [JOSE-Bibliotheken für Java](https://connect2id.com/products/nimbus-jose-jwt) stehen, den Autoren von [JOSE HPKE RFC](https://datatracker.ietf.org/doc/html/draft-reddy-cose-jose-pqc-hybrid-hpke-07) und [X-Wing RFC](https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/) sowie dem JDK-Sicherheitsteam in engem Kontakt und tragen diese neuen Standards zu Upstream-Projekten wie [X-Wing-Unterstützung im OpenJDK](https://github.com/openjdk/jdk/pull/26032) bei. All dies, um gemeinsam eine robuste Grundlage für die kommenden Jahre zu schaffen.