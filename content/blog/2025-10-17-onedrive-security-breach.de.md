---
title: "OneDrive-Sicherheitslücke zeigt: Zero-Knowledge-Verschlüsselung ist unverzichtbar"
slug: onedrive-sicherheitluecke
date: 2025-10-17
tags: [cryptomator, onedrive]

summary: "Die kürzlich entdeckte OneDrive-Sicherheitslücke zeigt, wie leicht Cloud-Dienste unbeabsichtigt sensible Daten preisgeben können."

ogimage:
  relsrc: /img/blog/onedrive-security-breach.png
  width: 1200
  height: 675
---

Im **Mai 2025** veröffentlichte das Sicherheitsteam von **Oasis Security** eine [Analyse](https://www.oasis.security/blog/onedrive-file-picker-security-flaw-oasis-research), die in der Cloud-Welt für Aufsehen sorgte: Über eine **Schwachstelle im OneDrive File Picker** konnten Drittanbieter-Anwendungen auf Dateien zugreifen, für die eigentlich keine Zugriffsrechte bestanden. Betroffen waren **Millionen Nutzer:innen** – sowohl privat als auch in Unternehmen.

Was genau ist passiert, warum ist dieser Vorfall so brisant – und was kannst du daraus lernen, um deine eigenen Daten besser zu schützen?

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/onedrive-security-breach.png" alt="OneDrive-Sicherheitslücke zeigt: Zero-Knowledge-Verschlüsselung ist unverzichtbar" />
</figure>

## Was ist beim OneDrive File Picker schiefgelaufen?

OneDrive File Picker ist eine beliebte Schnittstelle, mit der Apps auf Dateien aus dem persönlichen Cloud-Speicher zugreifen können. Doch Oasis Security fand heraus, dass **bestimmte Konfigurationsfehler** es ermöglichten, dass Anwendungen Dateien einsehen und herunterladen konnten, auf die sie offiziell keinen Zugriff hatten – selbst sensible Inhalte wie Steuerunterlagen, Projektpläne oder vertrauliche Gesprächsprotokolle.

Schlimmer noch: Die betroffenen Anwendungen mussten nicht einmal einen Exploit verwenden – es reichte, den File Picker korrekt (oder besser gesagt: falsch) zu nutzen. **Das Problem war kein gezielter Hack, sondern ein Konstruktionsfehler im System.**

## Die wahre Lektion: Vertrauen ist kein Sicherheitskonzept

Viele Nutzer:innen vertrauen darauf, dass Cloud-Anbieter wie Microsoft, Google oder Apple ihre Daten zuverlässig absichern. Doch der Vorfall zeigt: Auch große Plattformen machen Fehler – mit weitreichenden Folgen.

Das **eigentliche Problem** liegt tiefer:

- **Zugriffsrechte** werden im Backend verwaltet, nicht durch den oder die Nutzer:in selbst.
- Dateien liegen oft **unverschlüsselt** auf den Servern – oder nur mit einem Schlüssel, den der Anbieter selbst kontrolliert.
- **Sicherheitslücken in Drittanbieter-Apps oder Webinterfaces** können ausgenutzt werden, ohne dass Betroffene es merken.

**Kurz gesagt**: Wer seine Daten ausschließlich dem Sicherheitsversprechen von Cloud-Anbietern überlässt, gibt die Kontrolle aus der Hand.

## Die Lösung: Zero-Knowledge-Verschlüsselung mit Cryptomator

Cryptomator setzt auf einen grundlegend anderen Ansatz: Die **Dateien werden lokal auf deinem Gerät verschlüsselt, bevor sie in die Cloud hochgeladen werden**. So bleiben deine Daten selbst dann geschützt, wenn der Cloud-Anbieter kompromittiert wird – oder wie im Fall von OneDrive schlichtweg Fehler macht.

Das bedeutet:

- **Niemand außer dir** kann deine Dateien lesen – nicht Microsoft, nicht Google, nicht wir.
- **Zugriffsrechte** sind zweitrangig, denn ohne den Schlüssel bleiben alle Daten unlesbar.
- Selbst **kompromittierte** APIs oder Drittanbieter-Apps bekommen nur verschlüsselten Datenmüll zu Gesicht.

Für Teams, Organisationen und Unternehmen bietet **Cryptomator Hub** die ideale Erweiterung:

- **Zentrale Verwaltung von verschlüsselten Tresoren (Vaults)**  
  IT-Admins können Vaults vorkonfigurieren und gezielt mit Nutzer:innen teilen – alles Ende-zu-Ende verschlüsselt.
- **Rollenbasierte Zugriffskontrolle**  
  Dank des rollenbasierten Systems legen Sie exakt fest, wer Vaults erstellen, öffnen oder verwalten darf – ohne zentrale Schlüsselverteilung.
- **Web of Trust für sichere Zusammenarbeit**  
  Teammitglieder verifizieren sich gegenseitig, wodurch eine vertrauenswürdige Umgebung entsteht – ganz ohne externe Zertifikatsstellen.
- **Nahtlose Integration in bestehende Cloud-Workflows**  
  Cryptomator Hub lässt sich bequem mit bestehenden Cloudspeichern wie OneDrive, Google Drive oder Dropbox kombinieren.

So ermöglicht Cryptomator Hub eine **hochsichere und zugleich praxisnahe Cloud-Nutzung im Team**, ohne die üblichen Kompromisse bei Datenschutz und Compliance. Besonders für Organisationen mit erhöhten Anforderungen – etwa **NGOs, Forschungseinrichtungen oder Unternehmen in regulierten Branchen** – ist das eine zukunftssichere Lösung.

## Was du jetzt tun kannst

Ob du OneDrive, Dropbox oder einen anderen Cloud-Dienst nutzt – der Vorfall zeigt, dass es **keine 100%ige Sicherheit** durch Anbieter alleine geben kann. Doch mit wenigen Schritten kannst du deine Risiken drastisch reduzieren:

- Nutze **Client-seitige Verschlüsselung** mit Tools wie Cryptomator.
- Speichere besonders sensible Dokumente nicht unverschlüsselt in der Cloud.
- **Sensibilisiere deine Teammitglieder** oder Kolleg:innen für das Thema Cloud-Zugriffsrechte.
- Überprüfe, welche Drittanbieter-Apps Zugriff auf deine Cloud haben.

## Fazit: Sicherheit beginnt mit Kontrolle

Die OneDrive-Sicherheitslücke ist kein Einzelfall – sondern ein Symptom eines Systems, das auf Vertrauen statt auf echte Kontrolle baut. Doch wer seine **Dateien bereits vor dem Upload verschlüsselt**, bleibt selbst im Fall schwerwiegender Sicherheitslücken geschützt.

Mit Cryptomator behalten Sie die volle Kontrolle – über Ihre Daten, Ihre Privatsphäre und Ihre digitale Sicherheit.
