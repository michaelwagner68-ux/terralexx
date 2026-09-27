# Livegang der neuen Terralexx-Website – Schritt für Schritt

Stand: 25.09.2026. Reihenfolge einhalten: erst Rechtliches (1–2), dann Technik (3–4), dann Inhalte (5).

---

## 1. Impressum und Datenschutz ✅ umgesetzt – bitte gegenlesen

Neue Seiten: `impressum.html` und `datenschutz.html` im neuen Design. Verlinkt im Footer, im Kontaktformular (Einwilligungstext) und im Lexxi-Chatfenster.

**Gegenüber der alten Seite geändert:**

| Alt | Neu | Grund |
|---|---|---|
| „§ 5 TMG“, „§§ 7–10 TMG“ | „§ 5 DDG“, „§§ 7–10 DDG“ | Das Telemediengesetz wurde am 14.05.2024 durch das Digitale-Dienste-Gesetz ersetzt. |
| Link zur EU-Streitschlichtungsplattform (OS) | entfernt | Die OS-Plattform wurde am 20.07.2025 eingestellt, der Link führt ins Leere. Der Satz zur Verbraucherschlichtung bleibt. |
| Verantwortlich nach MStV: „TERRALEXX GmbH“ | Jürgen Aurin und Michael Wagner | § 18 Abs. 2 MStV verlangt eine natürliche Person. |
| Absatz „Rechtskonformität … ohne Kostennote“ | entfernt | Diese Klausel hat keine rechtliche Wirkung gegenüber Abmahnungen. |
| Datenschutz: „vertreten durch Jürgen Aurin“ | beide Geschäftsführer | Einheitlich mit dem Impressum. |
| — | Hinweis zu Lexxi und KI-generierten Bildern im Impressum | Transparenz. |

**Ihr müsst ergänzen bzw. prüfen:**
- [ ] **USt-IdNr.** – falls vorhanden, Pflichtangabe. Steht als auskommentierte Zeile in `impressum.html`, einfach Nummer eintragen und die Kommentarzeichen `<!--` / `-->` entfernen.
- [ ] **Netlify-Adresse** – aus der alten Erklärung übernommen (2325 3rd Street, Suite 29). Aktuelle Adresse bitte in der [Netlify-Datenschutzerklärung](https://www.netlify.com/privacy/) prüfen.
- [ ] **Registergericht:** „Amtsgericht Duisburg“ (war „Duisburg“) – bitte mit dem Handelsregisterauszug abgleichen.

## 2. Datenschutzerklärung ergänzt ✅ umgesetzt – rechtliche Prüfung nötig

Neu aufgenommen:
- **Kontaktformular über Netlify Forms** – welche Felder, Spamfilter (Akismet), Speicherdauer.
- **KI-Assistent Lexxi** – klarer Hinweis „Lexxi ist kein Mensch, sondern ein KI-System“ (Transparenzpflicht nach Art. 50 EU AI Act, gilt seit 02.08.2026), Übermittlung an Anthropic (USA), keine Speicherung der Chats bei euch, Einwilligung bei „Rückmeldung anfordern“.
- **KI-Check** – läuft nur im Browser.
- **Lokaler Speicher** – ein Merker im sessionStorage für die Lexxi-Sprechblase.
- **Schriftarten** – liegen jetzt lokal auf dem Server (`assets/fonts/`), keine Verbindung mehr zu Google Fonts. Damit entfällt das Abmahnrisiko wegen Google Fonts.

**Aufgaben:**
- [ ] **AV-Vertrag mit Anthropic:** Das Data Processing Addendum ist Teil der kommerziellen Nutzungsbedingungen von Anthropic. In der Anthropic Console unter den Organisations-/Rechtseinstellungen prüfen und ein PDF für eure Unterlagen ablegen.
- [ ] **AV-Vertrag mit Netlify** ablegen (Link steht in der Datenschutzerklärung).
- [ ] **Speicherfrist umsetzen:** In der Erklärung steht „Löschung bei Netlify spätestens nach 90 Tagen“. Das müsst ihr tatsächlich tun (Netlify → Forms → Einträge löschen), z. B. als Monatstermin im Kalender. Alternativ die Frist im Text anpassen.
- [ ] **Datenschutzbeauftragter:** Ab 20 Personen, die ständig personenbezogene Daten verarbeiten, Pflicht. Falls vorhanden, Kontakt in Abschnitt 2 ergänzen.
- [ ] **Rechtliche Prüfung** durch Anwalt oder Datenschutzbeauftragten. Insbesondere die Angaben zu Anthropic (Speicherdauer, Übermittlungsgrundlage) und Akismet bitte gegen die aktuellen Anbieterbedingungen prüfen.

## 3. Lexxi aktivieren

**Voraussetzung:** Die neue Seite liegt im Git-Repository, aus dem Netlify baut (siehe „Deployment“ unten).

1. **API-Schlüssel erstellen:** [console.anthropic.com](https://console.anthropic.com) → *API Keys* → *Create Key*, Name z. B. `terralexx-website-lexxi`. Den Schlüssel sofort kopieren, er wird nur einmal angezeigt.
2. **Ausgabenlimit setzen:** In der Console unter *Settings → Limits* ein monatliches Limit eintragen, z. B. 50 €. Ist es erreicht, antwortet Lexxi automatisch aus der eingebauten Wissensbasis weiter.
3. **In Netlify hinterlegen:** Site → *Site configuration* → *Environment variables* → *Add a variable*:

   | Variable | Wert | Pflicht |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | der Schlüssel aus Schritt 1 | ja |
   | `LEXXI_MODEL` | `claude-haiku-4-5` für niedrigere Kosten; weglassen = `claude-opus-5` | nein |
   | `LEXXI_ENABLED` | `false` schaltet die KI ab (Notaus) | nein |
   | `ALLOWED_ORIGINS` | weitere Domains, falls die Seite auch anders erreichbar ist | nein |

4. **Neu deployen:** *Deploys* → *Trigger deploy* → *Deploy site*. Umgebungsvariablen greifen erst nach einem neuen Deploy.
5. **Testen:** Website öffnen, Lexxi fragen „Was macht ihr genau?“. Eine frei formulierte Antwort (nicht eine der Standardantworten) zeigt, dass die KI läuft. Fehler findet ihr unter *Logs → Functions → lexxi*.

**Kosten (grobe Schätzung):** Pro Gespräch mit etwa 5 Nachrichten ca. 5–15 Cent mit Claude Opus 5, ca. 1–3 Cent mit Claude Haiku 4.5. Opus antwortet spürbar besser, Haiku genügt meist für FAQ-artige Fragen. Tipp: mit Opus starten, nach 4 Wochen die Kosten in der Console ansehen.

**Eingebaute Schutzmechanismen:** Nur Anfragen von eurer eigenen Domain werden beantwortet. Maximal 16 Nachrichten pro Verlauf, je 1.500 Zeichen. Bei jedem Fehler fällt das Widget auf die Standardantworten zurück, der Chat bricht also nie ab.

**Lexxi-Wissen anpassen:** Was Lexxi über Terralexx weiß und wie er sich verhält, steht im `SYSTEM`-Text oben in `netlify/functions/lexxi.mjs`. Sobald ihr Preise, Fallbeispiele oder neue Leistungen habt, dort ergänzen.

## 4. E-Mail-Benachrichtigung für Anfragen

1. **Formularerkennung einschalten:** Netlify → Site → *Forms* → *Enable form detection* (bei neueren Sites standardmäßig aus). Danach einmal neu deployen. Unter *Forms* müssen dann zwei Formulare erscheinen: **kontakt** und **lexxi-lead**.
2. **Benachrichtigung anlegen:** *Site configuration* → *Notifications* → *Emails and webhooks* → *Form submission notifications* → *Add notification* → *Email notification*.
   - E-Mail an: `info@terralexx.com`
   - Formular: *Any form* (oder je eine Benachrichtigung für `kontakt` und `lexxi-lead`)
3. **Test:** Kontaktformular einmal selbst ausfüllen. Nach wenigen Minuten sollte die Mail da sein. Falls nicht: Spam-Ordner prüfen und unter *Forms → Spam submissions* nachsehen.
4. **Kontingent prüfen:** Netlify Forms ist im Tarif begrenzt. Unter *Usage* sehen, wie viele Einträge pro Monat inklusive sind.
5. **Optional:** Automatische Weiterleitung ins CRM (z. B. HubSpot) über *Webhook*-Benachrichtigung oder Zapier/Make statt E-Mail.

## 5. Inhalte ergänzen

- [x] **Foto Jürgen Aurin** bestätigt.
- [x] **Preis KI-Potenzial-Workshop:** 3.900 € netto zzgl. USt., 3 Termine à 3 Std. vor Ort, Reisekosten innerhalb NRW inklusive. Eingetragen in Paketkarte, FAQ, Lexxi (Wissensbasis + KI-Anweisung) und englischer Version. Bei Änderung alle vier Stellen anpassen (Suche nach `3.900`).
- [ ] **JARLEXX-Abschnitt** (nach „Leistungen“, Video `assets/jarlexx.mp4`): Die drei Nutzenpunkte sind Formulierungsvorschläge – bitte mit den echten Eigenschaften der Plattform abgleichen („herstellerneutral / keine Lizenzen“ wurde bereits überall ersetzt durch „anbieterunabhängig / an keinen KI-Anbieter gebunden, JARLEXX als Fundament“ – bitte bestätigen, dass JARLEXX verschiedene KI-Modelle unterstützt). Lexxi kennt nur die Grundaussage und bietet für Details eine Demo an.
- [x] **Social Media:** Instagram (`instagram.com/terralexx.ai`) im Footer verlinkt und für Google hinterlegt. LinkedIn vorerst nicht.
- [x] **Englische Version** – DE/EN-Umschalter oben in der Navigation. Die Wahl wird gespeichert; `https://www.terralexx.com/?lang=en` öffnet direkt Englisch (z. B. für LinkedIn). Besucher mit nicht-deutschem Browser sehen beim ersten Besuch automatisch Englisch. Lexxi antwortet in der Sprache des Besuchers.
  - **Texte ändern:** Deutsche Texte stehen wie gewohnt im HTML, die englischen im `EN`-Wörterbuch im Skript unten in `index.html` (Schlüssel = deutscher Text). **Wichtig:** Wer einen deutschen Text ändert, muss den Schlüssel im Wörterbuch mit ändern, sonst bleibt die Stelle auf Englisch deutsch.
  - **Bewusst deutsch geblieben:** Impressum, Datenschutzerklärung und die drei PDFs (in der englischen Ansicht mit „(German)“ gekennzeichnet). Rechtlich genügt die deutsche Fassung.
  - Bei Preisänderung auch den englischen Eintrag für `Festpreis` / `/ 1 Tag` anpassen.

## Deployment (neue Seite live schalten)

Die aktuelle Live-Seite kommt aus dem Ordner `terralexx-main/`. Für den Wechsel:
1. Den bisherigen Stand sichern (z. B. Git-Branch `alte-website`).
2. Inhalt von `redesign-2026/` nach `terralexx-main/` kopieren (inkl. `netlify.toml`, `package.json`, `netlify/`, `assets/`, `downloads/`). Die alte `index.html` und `terralexx.html` ersetzen bzw. entfernen.
3. Committen und pushen. Netlify baut automatisch und installiert dabei das Anthropic-Paket aus `package.json`.
4. Schritte 3 und 4 oben durchführen und alles einmal auf Handy und Desktop testen.
