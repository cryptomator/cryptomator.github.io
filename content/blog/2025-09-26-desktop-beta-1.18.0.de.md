---
title: "Cryptomator Desktop 1.18.0 Beta – Jetzt testen!"
slug: desktop-beta-1.18.0
date: 2025-09-26
notice: 
tags: [cryptomator, desktop, beta]

summary: "Die Beta 1.18.0 von Cryptomator Desktop ist da: neue Features, wichtige Fixes und ein neues Windows-Zertifikat. Testet sie jetzt und gebt uns Feedback!"

ogimage:
  relsrc: /img/blog/desktop-1-18-0.png
  width: 1200
  height: 675
---

<figure class="text-center">
  <img class="inline-block rounded-sm" src="/img/blog/desktop-1-18-0.png" alt="Cryptomator Desktop 1.18.0 Beta" />
</figure>

Die nächste Version von Cryptomator Desktop steht in den Startlöchern – und bevor wir das finale Release veröffentlichen, laden wir euch ein, die Beta von Version 1.18.0 auszuprobieren. Neben praktischen neuen Features und wichtigen Bugfixes gibt es diesmal auch einen besonderen Aufruf an unsere Community.

## Neue Features & Fixes

Mit Cryptomator Desktop 1.18.0 bringen wir wieder einige Verbesserungen und Bugfixes für alle Plattformen:

#### Neues Feature

- Merken des letzten Tresor-Speicherorts  
  Wenn ihr einen neuen Tresor erstellt, schlägt Cryptomator nun automatisch den zuletzt gewählten Speicherort vor. Das macht die Einrichtung komfortabler, besonders wenn ihr mehrere Tresore in ähnlichen Ordnerstrukturen ablegt.

#### Fixes

- Linux/KDE: QuickAccess-Einträge  
  Unter KDE wurden bei jedem Entsperrvorgang ein neuer QuickAccess Eintrag im Dolphin Dateimanager erstellt, auch wenn ein Eintrag schon existierte (z.B. durch ein unerwartetes Schließen der App). Dieses Verhalten ist nun behoben – alte Einträge werden wieder verwendet und es ist kein manuelles Aufräumen nötig.
- Vermeidung riesiger Logfiles  
  Unter Windows konnte in seltenen Fällen Logdateien der App extrem groß werden, was zu Systemproblemen führte. Die existierende Größenbegrenzung der Logdateien wurde dabei umgangen. Dies ist behoben, sodass die App ohne Probleme im Hintergrund ausgeführt werden kann.
- macOS: Stabilität beim Speichern von Tresor-Passwörtern  
  Einige Nutzer:innen erlebten einen App-Crash, wenn sie das Tresor-Passwort speichern wollten. Dieser Fehler ist nun behoben, sodass die Passwortspeicherung unter macOS zuverlässig funktioniert.
- macOS: Erkennung von macFUSE unter macOS 26  
  Unter der kommenden macOS-Version 26 wurde macFUSE teilweise nicht erkannt, was zu Problemen beim Einbinden von Tresoren führen konnte. Dieses Problem ist behoben, damit Cryptomator auch auf den neuesten macOS-Versionen reibungslos läuft.

<div class="text-center">
  <a href="https://github.com/cryptomator/cryptomator/releases/tag/1.18.0-beta1/"><i class="fa-solid fa-download"></i> Beta 1.18.0 herunterladen</a>
</div>

## Wir brauchen eure Unterstützung!

Neben diesen Neuerungen gibt es diesmal noch eine Besonderheit:  
Unser Windows-Installer ist ab sofort mit einem neuen Zertifikat signiert. Da dieses Zertifikat im Microsoft-Trust-Netzwerk noch nicht bekannt ist, kann es vorkommen, dass Windows beim Installieren der Beta-Version einen Sicherheitsdialog anzeigt.

Je mehr Personen die Beta installieren, desto schneller wird das Zertifikat akzeptiert – und der Dialog verschwindet. Keine Sorge: Der Installer ist weiterhin sicher und von uns signiert. Windows muss lediglich „lernen“, dass das neue Zertifikat vertrauenswürdig ist.

## Schlusswort

Mit Version 1.18.0 machen wir Cryptomator wieder ein Stück komfortabler, stabiler und zukunftssicherer. Die Beta ist dabei ein wichtiger Schritt – nicht nur, um die neuen Features und Fixes zu testen, sondern auch, um unser neues Zertifikat im Windows-Ökosystem zu etablieren.

Wir freuen uns über jede Unterstützung aus der Community:

- Installiert die Beta und probiert die Neuerungen aus.
- Gebt uns Feedback, wenn euch etwas auffällt.
- Helft uns, die finale Version gemeinsam so stabil und nutzerfreundlich wie möglich zu machen.

Euer Feedback macht Cryptomator stärker – und sorgt dafür, dass wir alle unsere Daten sicher verschlüsseln können.

Vielen Dank für eure Mithilfe – wir freuen uns schon auf das finale Release von 1.18.0! 🎉