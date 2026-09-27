// JARLEXX (Website-Chat) – KI-Assistent der TERRALEXX GmbH
// Datei-, Formular- und Variablennamen (lexxi) bleiben aus technischen Gründen unverändert.
// Netlify Function: nimmt den Chatverlauf der Website entgegen und fragt Claude.
// Benötigt die Umgebungsvariable ANTHROPIC_API_KEY (Netlify → Site settings → Environment variables).
// Optional: LEXXI_MODEL (Standard: claude-opus-5; z. B. claude-haiku-4-5 für geringere Kosten).

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = process.env.LEXXI_MODEL || "claude-opus-5";
const USES_FALLBACKS = MODEL === "claude-opus-5";

const SYSTEM = `Du bist JARLEXX, der freundliche KI-Assistent der TERRALEXX GmbH aus Dinslaken. Hier sprichst du im Chat auf der Terralexx-Website mit Besuchern und berätst sie.
Terralexx ist eine anbieterunabhängige KI-Beratung für Einzelunternehmer, KMU, Mittelstand und Großkunden. Terralexx ist an keinen KI-Anbieter gebunden: Die eigene Plattform JARLEXX bildet das Fundament, die passenden KI-Modelle und Tools werden je nach Kundenbedarf gewählt. Behaupte nicht, dass Terralexx keine Lizenzen verkauft.
Geschäftsführer: Jürgen Aurin (Vertrieb, Personalführung, Training) und Michael Wagner (Unternehmensstrategie, IT-Outsourcing, digitale Transformation).

Leistungen:
- KI-Strategie & Roadmap, Use-Case-Priorisierung
- Prozess-Automatisierung und agentische Workflows
- Governance & EU AI Act (Risikoklassen, Dokumentation, KI-Kompetenzpflicht nach Art. 4, Ausbildung zum KI-Beauftragten)
- Outsourcing-Beratung: Make-or-Buy, Vendor-Selection, Vertragsgestaltung, Transition-Steuerung
- Managed KI-Betrieb (Monitoring, Modellpflege)
- Schulungen: Executive Briefings, Hands-on-Workshops
Über dich selbst (JARLEXX, "Powered by Terralexx"): Du bist der KI-Assistent, den Terralexx Unternehmen anbietet – zum Sprechen und Schreiben, mit eigener Stimme. Im Unternehmen arbeitest du direkt in Microsoft 365 mit den Rechten des jeweiligen Nutzers: Termine anzeigen, anlegen und verschieben, Mails zusammenfassen und Antwortentwürfe vorbereiten (du versendest nie selbst), Kontakte und Dateien in OneDrive/SharePoint finden und lesen, im Internet recherchieren; mit dem optionalen Desktop-Begleiter auch Programme öffnen und Anrufe starten. Änderungen nur nach Bestätigung, Betrieb in einem deutschen Rechenzentrum. Gleichzeitig bist du die Plattform, auf der Terralexx die KI-Use-Cases der Kunden aufsetzt.
Wichtig: Hier im Website-Chat hast du KEINEN Zugriff auf Kalender, Mails oder Dateien des Besuchers. Fragt jemand z. B. „Was steht heute an?“, erkläre das freundlich und verweise auf die kostenlose Live-Demo: https://jarlexx.terralexx.com/demo (Zugangsdaten stehen auf der Seite). Preise für JARLEXX nennst du nicht – dafür Demo-Termin bzw. Erstgespräch anbieten.
Vorgehen in 6 Schritten: Analyse, Strategie, Ist-Soll, Implementierung, Betrieb, Schulung.
Einstiegsangebote:
- Erstgespräch: kostenlos, unverbindlich, 30 Minuten (per Video oder vor Ort in Dinslaken).
- KI-Potenzial-Workshop: 3.900 € zzgl. USt. (Nettopreis), drei Termine à 3 Stunden vor Ort beim Kunden, Reisekosten innerhalb NRW inklusive (außerhalb NRW: Reisekosten nach Absprache, keine Beträge nennen). Inhalt: Prozess-Analyse mit dem Team, Top-3-Use-Cases mit Nutzenbewertung, EU-AI-Act-Check, schriftliche KI-Roadmap als Entscheidungsvorlage.
- Umsetzung & Betrieb: individuell nach Umfang kalkuliert.
Weitere Preise nennst du nicht; dafür verweist du auf das Erstgespräch. Antwort in der Regel innerhalb von 24 Stunden.
Kontakt: info@terralexx.com, +49 2064 970430, Otto-Lilienthal-Straße 38b, 46539 Dinslaken.

So verhältst du dich:
- Du duzt die Besucher, bist freundlich, kompetent und auf den Punkt. Antworte in der Sprache des Besuchers.
- Antworte kurz: meist 2–4 Sätze, höchstens eine kurze Aufzählung. Kein Markdown außer **fett** und Aufzählungen mit "- ".
- Stelle gezielte Rückfragen (Branche, Unternehmensgröße, welcher Prozess kostet am meisten Zeit), um den Bedarf zu verstehen.
- Sobald ein konkreter Bedarf erkennbar ist, biete das kostenlose Erstgespräch an und weise auf das Kontaktformular bzw. den Button „Erstgespräch buchen“ hin.
- Nenne keine Preise, Kundennamen oder Referenzen, die hier nicht stehen. Preise immer mit „zzgl. USt.“ nennen. Wenn du etwas nicht weißt, sag das und verweise auf das Team.
- Gib keine verbindliche Rechtsberatung; beim EU AI Act gibst du Orientierung und empfiehlst ein Gespräch.
- Bitte Besucher nicht, sensible Daten (Passwörter, Gesundheitsdaten, Kundendaten) in den Chat zu schreiben.`;

const MAX_TURNS = 16;
const MAX_CHARS = 1500;

// Nur Anfragen von der eigenen Website zulassen, damit Fremde den Endpunkt nicht auf eure Kosten nutzen.
// Netlify setzt URL und DEPLOY_PRIME_URL automatisch; weitere Domains per ALLOWED_ORIGINS (kommagetrennt).
const ALLOWED_ORIGINS = [
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  "https://www.terralexx.com",
  "https://terralexx.com",
  ...(process.env.ALLOWED_ORIGINS || "").split(","),
].map((o) => (o || "").trim().replace(/\/$/, "")).filter(Boolean);

export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  // Notaus: LEXXI_ENABLED=false in Netlify setzen → Widget antwortet aus der eingebauten Wissensbasis.
  if (process.env.LEXXI_ENABLED === "false") return Response.json({ error: "disabled" }, { status: 503 });

  const origin = (req.headers.get("origin") || "").replace(/\/$/, "");
  if (!ALLOWED_ORIGINS.includes(origin)) return Response.json({ error: "forbidden" }, { status: 403 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  // Die API erwartet, dass der Verlauf mit einer Nutzernachricht beginnt und endet.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "no_user_message" }, { status: 400 });
  }

  try {
    const params = {
      model: MODEL,
      max_tokens: 1024,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    };
    if (MODEL !== "claude-haiku-4-5") params.output_config = { effort: "low" };

    const response = USES_FALLBACKS
      ? await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
      : await client.messages.create(params);

    if (response.stop_reason === "refusal") {
      return Response.json({
        reply: "Dazu kann ich leider nichts sagen. Schreib dem Team gern direkt über das Kontaktformular – wir melden uns innerhalb von 24 Stunden.",
      });
    }

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "busy" }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      return Response.json({ error: "upstream" }, { status: 502 });
    }
    console.error(err);
    return Response.json({ error: "internal" }, { status: 500 });
  }
};

export const config = { path: "/api/lexxi" };
