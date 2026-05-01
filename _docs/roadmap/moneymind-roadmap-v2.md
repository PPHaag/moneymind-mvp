# MoneyMind — Product Roadmap v2.0
**Gebaseerd op Masterprompt v4.2 | Bijgewerkt: 1 mei 2026**

---

## Visie

MoneyMind is een financial clarity engine — geen finance app.
De missie: mensen hun financiële realiteit laten begrijpen zodat ze betere beslissingen nemen.

Loop: **Understand → Decide → Act → Improve → Repeat**

---

## Huidige staat (mei 2026)

### Wat werkt
- Roast Tool — volledig functioneel, profielen, gedragsanalyse, trajectory
- Dashboard — AI insight, tool status, next move, academy link
- Builder — snapshot, prioriteiten, 90-dagenplan via AI
- Academy — 5 lessen + Tool Guides sectie
- Auth — magic link via Supabase, redirect naar dashboard
- Hosting — Vercel (`moneymind-mvp-five.vercel.app`)
- AI — Anthropic Claude Sonnet via `/api/ai-insight.js` en `/api/builder-plan.js`
- Supabase — `moneymind-db` actief, `users` + `tool_runs` tabellen met RLS

### Nog niet af
- Supabase data sync (tool resultaten worden nog niet opgeslagen per user)
- Free/pro gating nog niet geïmplementeerd
- PWA nog niet gebouwd
- AI prompt voor investing/beleggen educatie nog niet actief
- Academy video's nog niet aanwezig

---

## Fase 1 — Fundament (nu → Q2 2026)

**Doel:** Stabiele, installeerbare app met werkende auth en data persistentie.

### 1.1 PWA — Installeerbaar op telefoon
- `manifest.json` toevoegen
- Service worker toevoegen
- App icoon instellen
- Werkt op Android (volledig) en iOS (basis)
- Geen App Store nodig

### 1.2 Supabase data sync
- Tool resultaten opslaan per ingelogde user
- localStorage als primaire laag, Supabase als sync laag
- Dashboard laadt data uit Supabase bij herbezoek
- Basis voor alle paid features

### 1.3 Free/pro gating
- `user.plan` = `free` | `pro` in Supabase
- Free: Roast + Dashboard + eenmalige tool resultaten
- Pro: opslaan, history, geavanceerde AI, Academy advanced tracks
- Paywall trigger: op het moment dat gebruiker data wil bewaren

---

## Fase 2 — Groei (Q3 2026)

**Doel:** Gebruikers terugbrengen, waarde verhogen, eerste betalende users.

### 2.1 Edit My Data
- Gebruikers kunnen cijfers aanpassen als situatie verandert
- Nieuwe baan, erfenis, schuld aflossen
- Optie A: Roast opnieuw (snel)
- Optie B: Edit per tool — aanbevolen (Capital Map, Spending, Leakage)
- Optie C: "Iets is veranderd" mini-flow op dashboard
- Bouwen nadat Supabase sync staat

### 2.2 Progress tracking
- Dashboard toont verandering over tijd
- "Vorige keer: €X, nu: €Y"
- Gedragspatronen zichtbaar maken
- Basis voor MoneyMind Behavioral Index (MBI)

### 2.3 AI uitbreiden — investing & beleggen educatie
- AI legt uit: verschil sparen vs investeren vs vermogen bouwen
- Risicoprofielen uitleggen (conservatief, balanced, groei)
- Concepten: ETFs, index funds, samengestelde rente, diversificatie
- Gebruiker verbinden aan zijn financiële structuur en investeringsbereidheid
- Nooit advies — altijd educatie

### 2.4 Macro koppelingen
- EUR/USD en BTC/EUR real-time via API
- Inflatie data (ECB / CBS)
- Rente indicatoren
- Contextueel tonen in dashboard insight

---

## Fase 3 — Platform (Q4 2026)

**Doel:** MoneyMind wordt een terugkerend platform, niet een eenmalig tool.

### 3.1 Academy — volwaardige content laag
- 5 tracks: Foundation, Structure, Behavior, Growth, Independence
- Elke les: Concept → Waarom → Voorbeeld → Key insight → Reflectie → Volgende stap
- Video-ready structuur (tekst nu, video straks)
- Free tracks: Foundation + Behavior
- Pro tracks: Growth + Independence

### 3.2 Academy video's
- Korte videos (3-5 min per les), YouTube/Vimeo embedded
- Transcript als fallback
- Geen talking heads — clarity over productie

### 3.3 MoneyMind Behavioral Index (MBI)
- Score op basis van gedragspatronen over tijd
- Leakage, building ratio, buffer consistentie
- Niet een getal om je goed over te voelen — een spiegel

### 3.4 Mobiele app (native) — optioneel
- Alleen als PWA niet voldoende is voor discovery of features
- React Native of Flutter
- Triggers: push notificaties op schaal, biometrische login, App Store aanwezigheid

---

## Monetization

### Principe
> De gebruiker ervaart waarde eerst (gratis).
> Hij betaalt als hij die waarde wil bewaren en laten groeien.

### Free tier
- Volledige Roast Tool
- Dashboard met AI insight
- Eenmalige tool resultaten (niet opgeslagen)
- Academy core lessen (Foundation, Behavior)

### Pro tier
- Alle tool resultaten opgeslagen en gesynchroniseerd
- Historische data en voortgang
- Gepersonaliseerde AI insights over tijd
- Academy advanced tracks (Growth, Independence)
- MBI tracking
- Toekomstige integraties (open banking, pensioen data)

### Implementatie
- `user.plan` in Supabase: `free` | `pro`
- Geen advertenties. Geen affiliate links. Geen verborgen agenda.
- Simpele, transparante pricing — één tier.

---

## Technische stack

| Onderdeel | Technologie |
|---|---|
| Hosting | Vercel |
| Frontend | HTML / CSS / JS (vanilla) |
| API routes | Vercel Serverless (Node.js / CommonJS) |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-20250514`) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Magic Link |
| Domein | buildwithmoneymind.com (Cloudflare) |
| Repo | GitHub (`PPHaag/moneymind-mvp`) |
| Mobiel | PWA (fase 1), native optioneel (fase 3) |

---

## Bouwprincipe

> Elke feature moet antwoord geven op:
> **"Verbetert dit de clarity of de actie van de gebruiker?"**
>
> Elke monetization beslissing moet antwoord geven op:
> **"Krijgt de gebruiker duidelijk waarde voor dit?"**
>
> Als het antwoord nee is → niet bouwen.

---

## Backlog — user requests

| Item | Omschrijving | Prioriteit |
|---|---|---|
| Edit My Data | Cijfers aanpassen bij nieuwe situatie (baan, erfenis, schuld) | Na Supabase sync |

---

*Roadmap v2.0 — gebaseerd op Masterprompt v4.2 — 1 mei 2026*
