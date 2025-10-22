---
type: article
weight: 4

title: "Cybersicherheit nach den Microsoft-Hacks: Wie Unternehmen und Privatpersonen sich effektiv schützen können"
description: "Informiere dich, wie du dich vor einem Cyberangriff schützen kannst und was zu tun ist, wenn es schon zu spät ist."

ctatitle: "Du willst deine Daten mit Cryptomator absichern?"
ctatext: "Cryptomator sichert deine persönlichen Dateien in der Cloud und ist ohne Account nutzbar. Cryptomator Hub verwaltet den Teamzugriff und ist ideal für Teams und Organisationen."
ctalink: /de/#get-started
ctabutton: "Jetzt gegen zukünftige Angriffe absichern"

cardtitle: "Prävention von Cyberangriffen"
cardtext: "Informiere dich hier, wie man sich angesichts aktueller Cyberangriffe mit Technik, Awareness und rechtlicher Vorsorge effektiv schützt."
---

# Cybersicherheit nach den Microsoft-Hacks: Wie Unternehmen und Privatpersonen sich effektiv schützen können

Im Frühling 2025 erschütterten gleich **mehrere schwerwiegende Sicherheitslücken bei Microsoft** die digitale Welt. Besonders betroffen waren die Dienste **SharePoint und OneDrive**, die millionenfach in Unternehmen und Behörden weltweit genutzt werden. Die Folgen dieser Angriffe reichen von **gestohlenen Daten bis hin zu langfristigen Kompromittierungen ganzer IT-Infrastrukturen**. Doch was bedeutet das für Einzelpersonen und Unternehmen – und wie kann man sich gezielt schützen?

## Die Vorfälle im Überblick

Im **Juli 2025** wurde eine **kritische Zero-Day-Sicherheitslücke (CVE‑2025‑53770)** in Microsoft SharePoint Server bekannt. Diese Schwachstelle wurde von mehreren **staatlich gesteuerten Hackergruppen** ausgenutzt – darunter Gruppen, die Microsoft unter den Codenamen Storm-2603 und Linen Typhoon führt. Besonders besorgniserregend: Auch **sensible Einrichtungen** wie die US National Nuclear Security Administration sollen betroffen gewesen sein. Insgesamt wurden laut Sicherheitsanalysen **über 400 Organisationen weltweit** kompromittiert.

Nur wenige Wochen zuvor wurde eine **weitere Schwachstelle in Microsofts OneDrive File Picker** bekannt. Durch eine **fehlerhafte OAuth-Implementierung** konnten Drittdienste – wie Slack, ChatGPT oder Trello – **Zugriff auf das gesamte OneDrive-Archiv der Nutzenden** erhalten, obwohl nur der Upload einzelner Dateien erlaubt schien. Auch hier zeigte sich erneut, wie schnell scheinbar **harmlose Schnittstellen zum Einfallstor werden** können.

Diese Angriffe verdeutlichen: Klassische Sicherheitsvorkehrungen reichen längst nicht mehr aus – Unternehmen und Privatpersonen müssen ihre **Sicherheitsstrategie neu denken**.

## Wie kann man sich schützen? Prävention als Schlüssel

### Für Unternehmen

Die wichtigste Maßnahme ist das **sofortige Aktualisieren betroffener Systeme**. Microsoft hat nach den Vorfällen **Sicherheitsupdates** für alle gefährdeten SharePoint-Versionen veröffentlicht. Organisationen, die diese Updates nicht sofort einspielen, riskieren weiterhin Angriffe aus dem Netz – zum Teil auch durch automatisierte Exploits.

Darüber hinaus sollten Unternehmen ihre Systeme nach dem **Prinzip des Least Privilege** konfigurieren. Das bedeutet, dass Benutzende nur jene Zugriffsrechte erhalten, die er oder sie tatsächlich benötigen. Alle Konten sollten zusätzlich durch **Multi-Faktor-Authentifizierung (MFA)** abgesichert werden.

Auch der **Umgang mit Drittanbieter-Apps** bedarf klarer Richtlinien. Die OneDrive-Lücke zeigte deutlich, wie gefährlich unkontrollierte OAuth-Zugriffe werden können. Unternehmen sollten daher alle Integrationen regelmäßig überprüfen, **nur geprüfte Anwendungen zulassen** und verdächtige Autorisierungen schnell widerrufen.

Nicht zuletzt spielt die **Transparenz über Systemaktivitäten** eine zentrale Rolle. Moderne Sicherheitsinfrastrukturen wie **Security Information and Event Management (SIEM)** oder **Microsoft Defender** ermöglichen es, verdächtige Logins, Token-Erneuerungen oder API-Zugriffe frühzeitig zu erkennen.

Ein weiterer wichtiger Baustein in der präventiven Sicherheitsstrategie ist der **Einsatz von lösungsorientierter Verschlüsselungs- und Rollenverwaltung** – genau hier setzt **Cryptomator Hub** an. Die Software ermöglicht es Unternehmen, verschlüsselte Cloud-Speicher (Tresore) zentral zu verwalten und feingranulare **Zugriffsrechte über Rollen zu vergeben**. Dabei bleiben alle Daten clientseitig verschlüsselt, sodass selbst bei einem kompromittierten Cloud-Anbieter keine ungeschützten Informationen offengelegt werden. Durch Funktionen wie die rollenbasierte Vergabe von „Create Vault“- oder „Read/Write“-Rechten können interne Sicherheitsrichtlinien effektiv abgebildet und kontrolliert werden. Besonders im Fall von Remote-Work, Drittanbieter-Zugriffen oder dezentralen Teams bietet Cryptomator Hub einen **robusten Schutzschild gegen unautorisierte Zugriffe** – unabhängig von der Vertrauenswürdigkeit des Cloud-Backends.

### Für Einzelpersonen

Auch für Privatnutzende gilt: Sicherheit beginnt bei den eigenen Gewohnheiten. Wer regelmäßig Apps Zugriff auf seine Cloud-Dienste gewährt, sollte die **erteilten Berechtigungen regelmäßig in den Einstellungen überprüfen** und unnötige Verbindungen trennen.

Ein **langes, einzigartiges Passwort in Kombination mit MFA** ist mittlerweile Pflicht. Viele Angriffe beginnen mit sogenannten **"Credential Stuffing"-Attacken**, bei denen gestohlene Zugangsdaten aus alten Leaks automatisiert getestet werden.

Darüber hinaus empfiehlt es sich, **wichtige Daten** nicht nur in der Cloud, sondern zusätzlich lokal oder in einer **Ende-zu-Ende-verschlüsselten** Umgebung (wie etwa Cryptomator) zu sichern. Damit bleiben persönliche Dokumente auch dann geschützt, wenn der Cloud-Anbieter kompromittiert wird.

## Was tun, wenn der Ernstfall eintritt?

Trotz aller Vorsichtsmaßnahmen kann es passieren, dass ein **unautorisierter Zugriff auf sensible Systeme** festgestellt wird und vertrauliche Informationen möglicherweise entwendet wurden. In solchen Fällen zählt jede Minute.

Zunächst sollte das betroffene System sofort vom Netz getrennt werden, um eine **weitere Ausbreitung zu verhindern**. Parallel dazu müssen **Passwörter und OAuth-Tokens zurückgesetzt werden** – nicht nur für die betroffenen Konten, sondern im Zweifelsfall auch für verbundene Dienste und Admin-Accounts.

Anschließend gilt es, alle verfügbaren Logdaten zu analysieren, um den **Umfang des Angriffs** zu verstehen. Wann begann der Zugriff? Welche Daten wurden möglicherweise entwendet? Welche Systeme waren betroffen?

Unternehmen sollten darüber hinaus ein **internes Incident Response Team** aktivieren oder externe Fachkräfte hinzuziehen, um die Wiederherstellung koordiniert durchzuführen. Wichtig ist auch die **Kommunikation**: Kund:innen, Partner:innen und ggf. Behörden wie das BSI müssen je nach Umfang des Vorfalls informiert werden.

## Langfristige Sicherheitsstrategie: Vom Reagieren zum Verhindern

Langfristig ist es nicht ausreichend, nur auf Angriffe zu reagieren – es muss eine **proaktive Sicherheitskultur** etabliert werden. Dazu gehört:

- **Regelmäßige Penetrationstests**, um Schwachstellen vor Angriffen zu entdecken
- **Sicherheits-Schulungen für Mitarbeitende**, um Social Engineering und Phishing zu erkennen
- **Backups**, die regelmäßig getestet und offline gesichert werden
- **Transparente Prozesse** für App-Zugriffe und Rechtevergabe
- Und nicht zuletzt: **eine Notfallplanung**, die klare Abläufe im Fall eines Cyberangriffs definiert

Die Angriffe auf Microsoft zeigen einmal mehr, dass kein System zu groß oder zu etabliert ist, um Opfer zu werden. Der einzige Weg zu mehr Sicherheit ist, **Risiken frühzeitig zu erkennen**, **technische Schutzmaßnahmen** umzusetzen und die **digitale Resilienz** in der gesamten Organisation zu stärken.

### Verhaltenssicherheit: Der Mensch als Sicherheitsfaktor

**Technische Schutzmaßnahmen sind wichtig** – aber sie sind nur so stark wie das Sicherheitsbewusstsein der Menschen, die sie nutzen. Angreifende setzen gezielt auf den **"Human Factor"**, etwa durch Phishing, Social Engineering oder CEO-Fraud. Deshalb gehört es zur Pflicht eines modernen Sicherheitskonzepts, Mitarbeitende nicht nur zu informieren, sondern aktiv einzubinden.

Empfohlene Maßnahmen:

- Interaktive **Schulungen und Awareness-Kampagnen** (z. B. zu Phishing oder Passwortsicherheit)
- **Regelmäßige simulierte Angriffe** zur Überprüfung des Sicherheitsverhaltens
- **Klar kommunizierte Richtlinien** für den Umgang mit Daten, Geräten und Software (z. B. BYOD)
- **Integration von Sicherheitsthemen in den Arbeitsalltag** durch kurze Reminder oder E-Learnings

Ein aufgeklärtes Team erkennt Bedrohungen schneller, reagiert sicherer und unterstützt aktiv bei der Gefahrenabwehr.

### Datenschutz und Compliance (DSGVO & NIS-2)

Sicherheit ist nicht nur technisches Ziel, sondern auch **gesetzliche Verpflichtung**. Unternehmen in Europa unterliegen beispielsweise der **Datenschutz-Grundverordnung (DSGVO)** sowie zunehmend auch der **NIS-2-Richtlinie**, die konkrete Anforderungen an IT-Sicherheit definiert. Doch auch in **anderen Teilen der Welt** gelten inzwischen strenge gesetzliche Regelungen zum Schutz personenbezogener und unternehmenskritischer Daten.

**Was Unternehmen beachten sollten:**

- **Technisch-organisatorische Maßnahmen** (TOM) dokumentieren und regelmäßig aktualisieren
- **Datenschutz-Folgenabschätzungen** bei risikobehafteten Prozessen durchführen
- **Datenpannen** innerhalb von 72 Stunden an die zuständige Aufsichtsbehörde melden
- Nur **datenschutzkonforme Cloud-Dienste verwenden** – z. B. durch clientseitige Verschlüsselung mit Cryptomator Hub

**Weitere internationale Regelungen:**

- **USA**: Der **California Consumer Privacy Act (CCPA)** sowie der **California Privacy Rights Act (CPRA)** regeln den Schutz personenbezogener Daten auf Ebene des Bundesstaats. Zudem gewinnen Sicherheitsanforderungen durch das **Cybersecurity Framework des NIST** (National Institute of Standards and Technology) an Bedeutung.
- **Kanada**: Das **Personal Information Protection and Electronic Documents Act (PIPEDA)** schreibt Unternehmen umfangreiche Datenschutzmaßnahmen vor.
- **Brasilien**: Mit der **Lei Geral de Proteção de Dados (LGPD)** wurde ein Gesetz geschaffen, das der DSGVO in weiten Teilen ähnelt.
- **Asien**: Länder wie **Japan (APPI)**, **Südkorea (PIPA)** oder **Singapur (PDPA)** verfügen ebenfalls über moderne Datenschutzgesetze mit expliziten Sicherheitsanforderungen.

Ein **sauberes Compliance-Management** schützt nicht nur vor Bußgeldern, sondern schafft auch Vertrauen bei Kund:innen, Partner:innen und der Öffentlichkeit. 

### Shadow IT erkennen und eindämmen

Ein wachsendes Risiko stellt die sogenannte **Shadow IT** dar – also Anwendungen oder Dienste, die Mitarbeitende ohne Zustimmung oder Wissen der IT-Abteilung nutzen. Diese Tools entziehen sich jeder zentralen Kontrolle, wodurch sie zu Einfallstoren für Angriffe werden können.

Strategien gegen Shadow IT:

- Etablierung eines **klaren Genehmigungsprozesses** für Software-Einsätze
- Nutzung von **Cloud Access Security Broker (CASB)**, um Schattenanwendungen sichtbar zu machen
- **Aufklärungskampagnen**, warum unautorisierte Tools ein Risiko darstellen
- Aufbau eines **Self-Service-Portals** mit geprüften, sicheren Tools zur Minimierung der Umgehung

Indem Unternehmen Transparenz schaffen und Alternativen anbieten, können sie die Nutzung unsicherer Dienste wirksam reduzieren.

### Sicherheitsmetriken und Reporting

Um Fortschritte im Bereich IT-Sicherheit sichtbar zu machen und Verantwortlichkeiten zu klären, braucht es **konkrete Sicherheitskennzahlen** (KPIs). Nur wer misst, kann Schwächen identifizieren, vergleichen und verbessern.

Hier sind einige Beispiele für relevante KPIs:

- **MFA-Abdeckung** in der Belegschaft
- Anzahl **blockierter Phishing-Versuche** pro Monat
- Dauer von der **Entdeckung bis zur Behebung einer Schwachstelle**
- Anteil **gepatchter Systeme** im Verhältnis zur Gesamtheit
- **Reaktionszeit bei Sicherheitsvorfällen** (Mean Time to Respond – MTTR)

Diese Kennzahlen helfen nicht nur internen Teams, sondern liefern auch der Geschäftsführung und externen Partnern **nachvollziehbare Sicherheitsnachweise**.

### Kommunikation im Ernstfall

Wie ein Unternehmen im Angriffsfall kommuniziert, kann entscheidend für den langfristigen Ruf sein. Eine **transparente, sachliche und koordinierte Kommunikation** zeigt, dass Verantwortung übernommen wird.

Empfohlene Maßnahmen:

- Erstellung eines **Krisenkommunikationsplans** mit klaren Zuständigkeiten
- Vorbereitung von **Vorlagen** für Kunden- und Partnerinformationen
- Definition von **Pressesprecher:innen und Kommunikationsfreigaben**
- Kommunikation im Einklang mit **rechtlichen Meldepflichten und Datenschutzvorgaben**

Wer vorbereitet ist, kann auch im Ernstfall professionell, glaubwürdig und vertrauensstärkend reagieren.

## Fazit

Die jüngsten Sicherheitslücken bei Microsoft verdeutlichen, dass **digitale Angriffe** keine hypothetische Gefahr, sondern **eine reale Bedrohung sind** – für Unternehmen wie auch Privatnutzer. Wer jetzt handelt, kann nicht nur Schaden abwenden, sondern auch das Vertrauen von Kund:innen, Partner:innen und Mitarbeitenden langfristig sichern.

**Sicherheit ist kein Zustand, sondern ein Prozess**. Jede Investition in IT-Sicherheit ist eine Investition in Zukunftsfähigkeit.
