# Terralexx Homepage – Analyse & Maßnahmen zur Kundengewinnung

Stand: 25.09.2026 · Grundlage: `terralexx-main/index.html` (live auf terralexx.com)

## 1. Kritische Befunde (sofort beheben)

| # | Befund | Auswirkung |
|---|--------|-----------|
| 1 | **Kontaktformular sendet nichts.** `onsubmit` ruft nur `alert()` auf, die Felder haben kein `name`-Attribut. | Jede Anfrage über das Formular geht verloren. Besucher sehen „Vielen Dank“, bei euch kommt nichts an. |
| 2 | **Keine Messung.** Kein Analytics, kein Conversion-Tracking. | Ihr wisst nicht, wie viele Besucher kommen, woher, und wo sie abspringen. |
| 3 | **Keine Social-/SEO-Metadaten.** Keine Open-Graph-Tags, kein Favicon, keine strukturierten Daten (Schema.org), keine Canonical-URL. | Links auf LinkedIn/WhatsApp erscheinen ohne Bild; Google versteht die Firma schlechter (lokale Suche „KI-Beratung Dinslaken/Ruhrgebiet“). |
| 4 | **1,4 MB in einer HTML-Datei** (alle Bilder + Video als Base64 eingebettet). | Langsamer erster Seitenaufbau, kein Browser-Caching der Bilder, schlechtere Core Web Vitals. |
| 5 | **Vorhandene Lead-Magneten ungenutzt.** `downloads/` enthält EU-AI-Act-Kurzübersicht, Lehrplan KI-Beauftragter und Flyer – nirgends verlinkt. | Verschenktes Vertrauens- und Lead-Potenzial. |
| 6 | **Kleinere Fehler:** kaputte `alt`-Texte (`alt="KMU &amp; Einzelunternehmer</span> – …"`), nicht geschlossene `<span>` in der Vorteilsliste, `--mono`-Variable nicht definiert, Team nur mit Initialen statt Fotos. | Wirkt unfertig, schlechter für Barrierefreiheit/SEO. |

## 2. Kundengewinnung – was fehlt

1. **Kein konkretes Einstiegsangebot.** „Kostenlose Beratung“ ist austauschbar. Besser: drei klar benannte Einstiege (Erstgespräch 0 € · KI-Potenzial-Workshop zum Festpreis · Umsetzung & Betrieb).
2. **Keine Interaktion vor dem Kontakt.** Wer noch nicht bereit für ein Gespräch ist, hat keinen Grund, Daten zu hinterlassen → **KI-Reifegrad-Check** (4 Fragen, sofortiges Ergebnis) als Mikro-Conversion.
3. **Kein Social Proof.** Keine Kundenstimmen, Logos, Fallbeispiele oder Zahlen. Das ist der größte inhaltliche Hebel – selbst 2–3 anonymisierte Fallbeispiele („Handwerksbetrieb, 25 MA: Angebotserstellung von 3 h auf 30 min“) wirken stark.
4. **Keine Dringlichkeit.** Die KI-Kompetenzpflicht (Art. 4 EU AI Act, seit 02/2025) betrifft jeden Betrieb, der KI nutzt – ein perfekter Aufhänger, der bisher nur als Nebensatz vorkommt.
5. **Lexxi ist nicht auf der Seite.** Ihr habt ein starkes Maskottchen mit fertigem Design – es ist euer Wiedererkennungsmerkmal und passt perfekt zu einer KI-Beratung („wir nutzen selbst, was wir empfehlen“).
6. **Keine Terminbuchung.** Ein Kalender-Link (z. B. Calendly, Microsoft Bookings, Cal.com) senkt die Hürde enorm.
7. **Hero-Botschaft** ist generisch („KI-Potenziale erkennen …“). Besser nutzen-orientiert: „KI, die in deinem Betrieb wirklich ankommt.“

## 3. Umgesetzt im Prototyp (`redesign-2026/`)

- **Design im Framer-Stil:** Dark Mode, große enge Typografie (Inter Tight), Glow-Verläufe, Glas-Navigation, Bento-Grid, Hover-Spotlight auf Karten, Scroll-Reveal, Marquee-Band. Nutzt eure Studio-Bilder mit Lexxi.
- **Lexxi-Chatwidget:** Teaser-Bubble nach 9 s, Schnellantwort-Chips, Chat-Vorschau direkt im Hero. Spricht über `/api/lexxi` mit Claude (Netlify Function) und fällt ohne Backend auf eine eingebaute Wissensbasis zurück. Bietet bei Terminwunsch bzw. nach 3 Nachrichten eine **Lead-Erfassung im Chat** an (Name + E-Mail + Chatverlauf → Netlify-Formular `lexxi-lead`).
- **Mehrstufiges Kontaktformular** (Anliegen → Größe → Kontaktdaten) mit Netlify Forms, Honeypot-Spamschutz, Validierung, Erfolgs- und Fehlermeldung. Mehrstufige Formulare konvertieren i. d. R. deutlich besser als ein langes Formular.
- **KI-Reifegrad-Check** mit Score, Empfehlung und automatischer Übergabe ins Kontaktformular (Ergebnis landet in der Anfrage).
- **Einstiegspakete**, **EU-AI-Act-Band** mit den drei PDFs als Downloads, **Team** mit echtem Foto, **FAQ** inkl. „Was kostet das?“.
- **Technik:** Bilder als optimierte Einzeldateien (ca. 750 KB gesamt, einzeln cachebar und lazy geladen, statt 1,4 MB inline), OG-Tags, Favicon, Schema.org `ProfessionalService`, Canonical, Sticky-CTA mobil, `prefers-reduced-motion`, Fokus-Styles.

## 4. Vor dem Livegang zu erledigen

Siehe ausführliche Schritt-für-Schritt-Anleitung in [LIVEGANG-ANLEITUNG.md](LIVEGANG-ANLEITUNG.md) (Impressum/Datenschutz, Lexxi aktivieren, E-Mail-Benachrichtigung, offene Inhalte, Deployment).

## 5. Nächste Hebel (Wochen 2–8)

- **Social Proof:** 2–3 Fallbeispiele + Kundenstimmen (Sektion zwischen Leistungen und Paketen einplanen).
- **Terminbuchung** per Kalender-Link direkt im Formular-Erfolgsschritt und in Lexxi.
- **Analytics** cookiefrei (Plausible, Matomo ohne Cookies oder Netlify Analytics) mit Zielen: Formular gesendet, Chat-Lead, KI-Check abgeschlossen, PDF-Download.
- **Unterseiten für SEO:** je Leistung eine Seite (z. B. „KI-Beauftragter Schulung“, „EU AI Act Beratung NRW“, „Prozessautomatisierung Handwerk“) + Google-Unternehmensprofil pflegen.
- **Gated Content:** AI-Act-Kurzübersicht gegen E-Mail + Nurturing-Mail-Serie (3–4 Mails).
- **Lexxi weiterentwickeln:** Lexxi-Leads direkt ins CRM (z. B. HubSpot) übertragen, Kalenderlink im Chat, Gesprächsprotokolle monatlich auswerten → häufige Fragen in FAQ/Content übernehmen.
