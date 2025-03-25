---
title: "Cloud-Speicher verschlüsseln: Wie Open Source die Sicherheit stärkt"
type: article
description: "Vertrauen ist gut, Kontrolle ist besser: Willst du deinen Cloud-Speicher verschlüsseln, bietet dir Open-Source-Verschlüsselungssoftware noch mehr Schutz."
aliases: ["/de/open-source", "/de/faq/security", "/de/faq/security/opensource", "/de/faq/security/audits"]

ctatitle: "Du willst deinen Cloud-Speicher mit Cryptomator verschlüsseln?"
ctatext: "Cryptomator sichert deine persönlichen Dateien in der Cloud und ist ohne Account nutzbar. Cryptomator Hub verwaltet den Teamzugriff und ist ideal für Teams und Organisationen."
ctalink: /de/#get-started
ctabutton: "Jetzt deinen Cloud-Speicher verschlüsseln"

cardtitle: "Wie Open Source die Sicherheit stärkt"
cardtext: "Erfahre, wie Open-Source-Verschlüsselung deine Datensicherheit deutlich erhöht – und warum du Cloud-Anbietern nicht blind vertrauen solltest."
cardimage: /img/open-source/bartender-vs-stranger.png

ogimage:
  relsrc: /img/open-source/og-image.png
  width: 1200
  height: 541
---

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

# Deine Daten sicher im Cloud-Speicher verschlüsseln: Wie du durch Open Source deine Datensicherheit weiter erhöhst

<p class="lead">Vielleicht hast du dich jetzt schon eine Weile mit der Verschlüsselung deines Cloud-Speichers beschäftigt und bist dabei auf das Thema „Open Source“ gestoßen. Vielleicht fragst du dich, warum Open Source so wichtig ist, wenn du deinen Dateien verschlüsseln willst? Hier erklären wir es dir.</p>

<img class="inline-block" src="/img/open-source/bartender-vs-stranger.png" srcset="/img/open-source/bartender-vs-stranger.png 1x, /img/open-source/bartender-vs-stranger@2x.png 2x" alt="Der sicherheitsbewusste Kunde entscheidet sich für Produkte, deren Rezeptur und Qualität er prüfen kann. Nicht überprüfbare Alternativen wirken zwielichtig." />

Damit du noch besser nachvollziehen kannst, was Open Source eigentlich bedeutet, lass uns mit einem Beispiel starten.

Stell dir vor, du bist in einer fremden Stadt und besuchst abends einen Stadtteil, der als etwas zwielichtig gilt. Dort gehst du in eine Bar und willst etwas trinken.

Welche der folgenden Szenarien hört sich für dich sicherer an:

{{< /markdownify >}}</div>

<table class="my-6">
  <tr>
    <td class="text-center">
      <div class="fa-stack shrink-0 text-xl text-secondary">
        <i class="fas fa-circle fa-stack-2x"></i>
        <strong class="fa-stack-1x fa-inverse">1</strong>
      </div>
    </td>
    <td class="pl-3">
      <p class="font-p">Der Barkeeper bereitet deinen Drink live vor deinen Augen zu.</p>
    </td>
  </tr>

  <tr>
    <td class="text-center py-6">
      <p class="font-p">oder</p>
    </td>
    <td></td>
  </tr>

  <tr>
    <td class="text-center">
      <div class="fa-stack shrink-0 text-xl text-secondary">
        <i class="fas fa-circle fa-stack-2x"></i>
        <strong class="fa-stack-1x fa-inverse">2</strong>
      </div>
    </td>
    <td class="pl-3">
      <p class="font-p">Ein Unbekannter bietet dir etwas von seinem Getränk an.</p>
    </td>
  </tr>
</table>

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

Wahrscheinlich spürst du bereits eine Tendenz: Die fremde Person kann noch so nett aussehen – und in den meisten Fällen gibt es sicher keinen Grund für Misstrauen.

Doch du weißt nicht: Was, wenn da doch etwas in dem Drink ist, was da lieber nicht drin sein sollte?

Und möglicherweise kommt dir hier das alte Sprichwort in den Sinn: Vertrauen ist gut – Kontrolle ist besser.

## Vertrauen ist gut, Kontrolle ist besser – gerade, wenn du sensible Daten im Cloud-Speicher verschlüsseln willst {#trust-but-verify}

Und genau diesen Vorteil der Kontrolle bietet dir Open-Source-Software, wenn du deinen Cloud-Speicher (wie z.B. Dropbox) verschlüsseln willst.

Um noch einmal auf das Beispiel mit der Bar sprechen zu kommen: Grundsätzlich wäre es sogar möglich, dass du deinen Drink selbst mixt.

Denn Open Source ermöglicht dir genau das: Die Anleitung und alle Zutaten liegen bereit. Zusätzlich hast du sogar die Möglichkeit, das Rezept ggf. anzupassen und weiter zu verbessern.

## Wie genau Open-Source-Software deine Datensicherheit steigert {#advantages}

Vielleicht hast du Open Source auch schon mal unter dem Begriff „quelloffen“ kennengelernt. Diese Quelloffenheit siehst du auf den ersten Blick nicht. Denn die Vorteile liegen in den sicherheitsrelevanten Kriterien, die im Hintergrund ablaufen.

Bevor wir weitergehen, lass uns nun noch kurz die Maxime der Datenverschlüsselung (der Kryptographie) anschauen. Denn diese lautet:

Die Sicherheit eines Verschlüsselungsverfahrens muss allein vom Schlüssel abhängen und darf nicht auf der Geheimhaltung der Verschlüsselungsalgorithmen beruhen. (Das sogenannte {{< extlink "https://de.wikipedia.org/wiki/Kerckhoffs%E2%80%99_Prinzip" "Kerckhoffs’sche Prinzip" >}}.)

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/open-source/auguste-kerckhoffs.jpg" alt="Auguste Kerckhoffs" />
  <figcaption>Benannt nach {{< extlink "https://de.wikipedia.org/wiki/Auguste_Kerckhoffs" "Auguste Kerckhoffs" >}} (1835 – 1903)</figcaption>
</figure>

Da also die Sicherheit lediglich vom Schlüssel abhängt, ergibt sich durch die Veröffentlichung des Algorithmus kein Nachteil.

Gleichzeitig hat Quelloffenheit aber viele sicherheitsfördernde Vorteile:

{{< /markdownify >}}</div>

<div class="flex my-6">
  <div class="fa-stack shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-users fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="font-p mb-4">Der Quellcode kann von einer Community aus Programmierern – vom Hobbyprogrammierer bis zum Sicherheitsforscher – eingesehen werden, wodurch unbefugter Zugriff direkt erkannt wird.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-link" href="#" @click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Mehr erfahren</a>
      <div x-show="isLearnMoreOpen" x-cloak class="white-box mt-4">
        <div class="p-4">
          <p class="font-p mb-4">Weil jeder den Quellcode einsehen kann, wird verhindert, dass unbemerkt Hintertüren für Regierungen, Strafverfolgungsbehörden oder Geschäftspartner eingebaut werden können.</p>
          <p class="font-p"><strong>Würde also jemand Unbefugtes Zugriff auf deine Daten haben, würde das zumindest sehr schnell auffallen.</strong></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="flex my-6">
  <div class="fa-stack shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-sync fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="font-p mb-4">Der Quellcode wird ständig überprüft und somit laufend weiter verbessert.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-link" href="#" @click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Mehr erfahren</a>
      <div x-show="isLearnMoreOpen" x-cloak class="white-box mt-4">
        <div class="p-4">
          <p class="font-p mb-4">Abgesehen von offiziellen Audits wird der Quellcode auch von Dritten verwendet und somit ständig überprüft.</p>
          <p class="font-p mb-4">Werden dabei Schwachstellen gefunden, können diese nicht stillschweigend ignoriert werden. Falls es mal ein Problem gibt, fällt dies schnell auf und der Anbieter der Verschlüsselungssoftware ist zu einer zügigen Reaktion gezwungen. Sowohl die Ursache als auch die Abhilfe werden öffentlich dokumentiert.</p>
          <p class="font-p mb-4"><strong>Du kannst dich also darauf verlassen, dass die Sicherheit beim Verschlüsseln deines Cloud-Speichers nicht nur einmalig intensiv, sondern auch laufend durch Leute vom Fach verifiziert wird.</strong></p>
          <p class="font-p">Die Geschichte zeigt, dass in anderen Fällen (bei sogenannter Closed-Source-Software) Sicherheitslücken über Jahre ungefixt blieben, weil der Anbieter keinen öffentlichen Druck zur Reaktion hatte.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="flex mt-6 mb-12">
  <div class="fa-stack shrink-0 text-xl text-secondary mr-3">
    <i class="fas fa-circle fa-stack-2x"></i>
    <i class="fas fa-clouds fa-stack-1x fa-inverse"></i>
  </div>
  <div>
    <p class="font-p mb-4">Der Quellcode wird hundertfach kopiert, was die Verschlüsselung unabhängig vom Anbieter macht.</p>
    <div x-data="{ isLearnMoreOpen: false }">
      <a class="text-link" href="#" @click.prevent="isLearnMoreOpen = !isLearnMoreOpen"><i :class="{ 'fa-eye': !isLearnMoreOpen, 'fa-eye-slash': isLearnMoreOpen }" class="fas fa-fw"></i> Mehr erfahren</a>
      <div x-show="isLearnMoreOpen" x-cloak class="white-box mt-4">
        <div class="p-4">
          <p class="font-p mb-4">Selbst wenn der Anbieter der Verschlüsselungssoftware irgendwann seinen Betrieb einstellt, <strong>hast du weiterhin Zugriff auf deine verschlüsselten Daten und kannst deinen Cloud-Speicher weiterhin verschlüsseln.</strong></p>
          <p class="font-p">Denn der Quellcode wird hunderte Male kopiert und kann völlig legal von anderen weiterveröffentlicht werden.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="prose prose-sm md:prose max-w-none md:max-w-none">{{< markdownify >}}

## Cloud-Speicher mit Open-Source-Software verschlüsseln: Mit Cryptomator auf der sicheren Seite {#robust-crypto}

Cryptomator ist genauso eine solche Open-Source-Verschlüsselungssoftware. Dank des quelloffenen Charakters ist eine maximale Transparenz gewährleistet. Somit wird die Sicherheit deiner Daten also auf vielen Ebenen gesichert und ständig weiter erhöht:

1. Neben dem eigentlichen Code sind auch Qualitätsmetriken aus automatisierten Tests sowie Fehlerberichten öffentlich einsehbar.
2. Der Code wird ständig an die neuesten Standards angepasst.
3. Das Feedback aus der Community wird umgehend umgesetzt.
4. Wir nutzen erprobte Chiffren zur Verschlüsselung, deren korrekte Verwendung mehrfach auditiert und darüber hinaus permanent verifizierbar ist.
5. Uns ist es unmöglich, Sicherheitslücken etwa aus Marketinggründen zu verschweigen, weil der gesamte Code jederzeit von der Community geprüft werden kann.

All dies führt zu einer herausragenden Widerstandsfähigkeit der kryptografischen Umsetzung, die auch Auditoren hervorgehoben haben:

> The cryptographic implementation exhibited a quite exceptional level of robustness.
>
> _Die kryptografische Implementierung wies ein ganz außergewöhnliches Maß an Robustheit auf._

– {{< extlink "https://cryptomator.org/audits/2017-11-27%20crypto%20cure53.pdf" "Audit von Cure53" >}}

**In anderen Worten: Diese Robustheit erhöht deine Datensicherheit um ein Vielfaches, wenn du deine Dateien im Cloud-Speicher mit Open-Source-Software verschlüsselst.**

Mit Cryptomator haben wir zudem einen Fokus auf hohe Anwenderfreundlichkeit gelegt. Du kannst [Dropbox](/de/encrypt-dropbox/), Google Drive, OneDrive und Co. wie gewohnt nutzen und weißt gleichzeitig alle sensiblen Daten sicher.

{{< /markdownify >}}</div>
