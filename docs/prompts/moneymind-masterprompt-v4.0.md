# 📋 Instructions — Inbox Review

Dit document beschrijft hoe je een prompt uit de inbox beoordeelt, test en klaarstoomt voor opname in Prompt OS.

---

## 🎯 Doel van de review

Niet elke prompt die je tegenkomt is goed. De review is het kwaliteitsfilter van Prompt OS. Je beoordeelt of een prompt:

- Daadwerkelijk werkt zoals beloofd
- Uniek genoeg is om op te slaan
- Past binnen de structuur van Prompt OS
- Herbruikbaar is voor jou of anderen

---

## 🔄 Het review-proces stap voor stap

### Stap 1 — Eerste indruk (2 minuten)

Lees de prompt snel door en beantwoord deze vragen:

- [ ] Snap ik wat deze prompt doet?
- [ ] Is het doel duidelijk?
- [ ] Ziet het er serieus uit, of is het hype?

**Niet overtuigd na 2 minuten?** Verwijder hem. Er komen altijd nieuwe.

---

### Stap 2 — Context vastleggen

Vul de frontmatter aan voordat je gaat testen:

```yaml
---
title: [beschrijvende titel]
source: [x.com / reddit / blog / etc.]
found: [datum]
author: [naam of handle indien bekend]
domain: [business / finance / productiviteit / etc.]
type: [strategy / analysis / planning / writing / etc.]
model-tested: []
status: draft
tags: []
notes: [waarom leek dit interessant?]
---
```

---

### Stap 3 — Testen

Test de prompt met minimaal één model. Gebruik dit als leidraad:

#### Basistest
Voer de prompt uit zoals hij is — geen aanpassingen. Noteer:
- Wat doet het model precies?
- Is de output bruikbaar?
- Reageert het model zoals de prompt belooft?

#### Stresstest
Probeer een edge case of een moeilijker input. Houdt de prompt stand?

#### Vergelijkingstest *(optioneel)*
Test dezelfde prompt op een tweede model. Verschilt de output significant?

Noteer je bevindingen direct onder de prompt:

```markdown
## Testresultaten

**Model:** claude-sonnet-4-6
**Datum:** 2026-03-21
**Input gebruikt:** [korte omschrijving]
**Oordeel:** ✅ Werkt goed / ⚠️ Werkt deels / ❌ Werkt niet

**Observaties:**
- ...
- ...
```

---

### Stap 4 — Beoordelen

Geef de prompt een score op vier criteria:

| Criterium | Vraag | Score (1–5) |
|---|---|---|
| **Effectiviteit** | Doet de prompt wat hij belooft? | |
| **Helderheid** | Is de instructie duidelijk en ondubbelzinnig? | |
| **Herbruikbaarheid** | Kun je hem breed inzetten? | |
| **Originaliteit** | Voegt het iets toe wat je nog niet had? | |

**Totaalscore:** `/20`

Drempelwaarde:
- **15–20** → Direct opnemen in Prompt OS
- **10–14** → Opnemen na aanpassing
- **Onder 10** → Verwijderen

---

### Stap 5 — Verbeteren *(indien nodig)*

Scoort de prompt tussen 10 en 14? Verbeter hem voor opname:

- Maak vage instructies concreter
- Voeg een rolinstelling toe als die ontbreekt (`Je bent een...`)
- Definieer het gewenste outputformaat
- Vervang hardgecodeerde waarden door variabelen met `{{dubbele accolades}}`

Documenteer wat je hebt aangepast:

```markdown
## Aanpassingen

- Rolinstelling toegevoegd
- Outputformaat gespecificeerd als markdown tabel
- `bedrijfsnaam` vervangen door `{{bedrijfsnaam}}`
```

---

### Stap 6 — Verplaatsen naar Prompt OS

Is de prompt goedgekeurd? Verplaats hem naar het juiste domein:

```bash
mv inbox/to-review/mijn-prompt.md prompts/by-domain/<domein>/<naam>.md
```

Zorg dat voor het committen:

- [ ] Bestandsnaam volgt de naamgevingsconventie
- [ ] Frontmatter volledig ingevuld inclusief tags
- [ ] Minimaal één testresultaat gedocumenteerd
- [ ] Status bijgewerkt naar `tested` of `stable`
- [ ] Indien relevant: voorbeeld toegevoegd in `examples/`

---

## 🗑️ Wanneer verwijderen?

Verwijder een prompt als:

- Hij niet werkt na testen
- Hij te specifiek is voor eenmalig gebruik
- Er al een betere versie in Prompt OS zit
- De bron onbetrouwbaar of misleidend lijkt
- De hype groter is dan de daadwerkelijke output

> De inbox is geen archief. Wat hier te lang staat, verdient geen plek in het systeem.

---

## 📅 Review-ritme

| Frequentie | Actie |
|---|---|
| **Dagelijks** | Nieuwe vondsten droppen in `to-review/` |
| **Wekelijks** | `to-review/` doorlopen, snelle eerste indruk |
| **Maandelijks** | Diepere tests, scorecards invullen, verplaatsen |

---

## 💡 Tips

- **Review nooit in bulk** — maximaal 3-5 prompts per sessie, anders wordt het slordig
- **Test met echte inputs** — gebruik echte cases uit je werk, geen nep-voorbeelden
- **Wees kritisch op hype** — "holy grail" prompts op X zijn zelden zo goed als ze klinken
- **Itereer** — een prompt van 12/20 die je verbetert naar 17/20 is meer waard dan een nieuwe vondst

---

*Kwaliteit boven kwantiteit. Elke prompt die Prompt OS binnenkomt, heeft het verdiend.*
