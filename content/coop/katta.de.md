---
title: "Katta"
prio: 5
img: /img/coop/katta.png
img2x: /img/coop/katta@2x.png
description: "Katta macht aus deinem S3-Speicher einen sicheren Arbeitsbereich für Teams. Es verbindet die native Dateisystem-Integration von Mountain Duck mit der Zero-Knowledge-Schlüsselverwaltung von Cryptomator Hub."
ctalink: https://katta.cloud/
ctatext: "Weitere Infos unter katta.cloud"
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/coop/katta-banner.jpg" alt="Mountain Duck plus Cryptomator Hub ergibt Katta"/>
</figure>

Katta ist eine vollständige Verschlüsselungslösung für S3-Speicher, entwickelt für Teams und Organisationen. Katta Desktop stellt deine Tresore unter macOS und Windows als lokales Laufwerk bereit und hält sie synchron, sodass du keinen zusätzlichen Sync-Client brauchst. Unterstützt wird jeder S3-kompatible Speicher. Für AWS und MinIO stellt Katta zusätzlich temporäre Zugangsdaten aus, die auf den Bucket eines einzelnen Tresors beschränkt sind.

Wir freuen uns über diese Kooperation, weil sie zwei Produkte zusammenführt, die sich seit Jahren ergänzen: Katta Desktop basiert auf Mountain Duck, Katta Server auf Cryptomator Hub. Deine Dateien werden auf deinem Gerät verschlüsselt, bevor sie in deinen S3-Bucket hochgeladen werden, und die Schlüssel erreichen den Server nur in verschlüsselter Form. Weder der Speicheranbieter noch der Betreiber des Servers können deine Daten lesen.

Cryptomator Hub verwaltet die Schlüssel zu deinen Tresoren, überlässt es aber dir, wo die Tresore gespeichert und wie sie synchronisiert werden. Katta geht einen Schritt weiter: Katta Server kennt auch den Speicherort jedes Tresors, und die Mitgliedschaft in einem Tresor gewährt den Zugriff auf dessen Speicher. Genau wie Cryptomator Hub lässt sich Katta in dein bestehendes Identitätsmanagement integrieren, einschließlich OpenID Connect, SAML und LDAP.

Katta ist also die perfekte Wahl für Teams, die ihre Daten in eigenen S3-Buckets behalten und mit minimaler Konfiguration loslegen wollen.

Auch Katta Server und die Client-Bibliothek von Katta sind Open-Source-Software. Tresore werden im {{< extlink "https://github.com/encryption-alliance/unified-vault-format" "Unified Vault Format" >}} angelegt, einem offenen und herstellerunabhängigen Standard für verschlüsselte Verzeichnisse. Er basiert auf dem bewährten Tresorformat von Cryptomator und wird von uns gemeinsam mit den Entwicklern von Cyberduck, gocryptfs und rclone entwickelt.

Katta befindet sich derzeit im Soft Launch. Du kannst {{< extlink "https://katta.cloud/demo/" "die Demo" >}} ohne Anmeldung auf einer laufenden Katta-Instanz ausprobieren oder dich auf die Warteliste setzen lassen, um zu den Ersten zu gehören, wenn Katta öffentlich startet.
