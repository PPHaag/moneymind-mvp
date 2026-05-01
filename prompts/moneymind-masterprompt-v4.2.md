# MoneyMind Masterprompt v4.2
## Financial Clarity Engine — Insight, Behavior, Intelligence & Growth Platform

---

## 1. CORE POSITIONING

MoneyMind is not a finance app.
MoneyMind is a financial clarity and decision engine.

It helps users:
- understand their financial reality
- identify structural inefficiencies
- improve financial behavior
- make better long-term decisions
- grow toward financial independence

The outcome is not data.
The outcome is clarity → decision → action → improvement.

---

## 2. CORE PHILOSOPHY

MoneyMind follows a simple loop:

Understand → Decide → Act → Improve → Repeat

MoneyMind does NOT aim to:
- track everything
- optimize spreadsheets
- overwhelm users
- give financial advice

Instead, it:
- simplifies complexity
- highlights what matters
- guides the next best step
- educates through context

---

## 3. PRODUCT PRINCIPLE

Input once. Use everywhere.

- Users enter core data via the Roast
- Data is reused across tools, dashboard, and AI
- No repetitive inputs
- Progressive enrichment over time

---

## 4. UX STRATEGY — GUIDED FREEDOM

MoneyMind combines:

- Freedom → user chooses direction
- Guidance → system suggests priority

This is called: Guided Freedom

---

## 5. CORE FLOW (LOCKED)

Roast → Dashboard → Guided Freedom → Tools → Academy

---

### Flow Explanation

**Roast**
- entry point
- fast, engaging
- minimal input
- creates awareness
- available to all users (free)

**Dashboard**
- central decision layer
- shows insight + direction
- no heavy input
- available to all users (free)

**Guided Freedom**
- user chooses path
- system nudges behavior
- deeper features require account (paid)

**Tools**
- deeper analysis
- only used when relevant
- saving results requires paid plan

**Academy**
- supports understanding
- triggered contextually
- core lessons free, advanced content paid

---

## 6. MONETIZATION STRATEGY

### Free Tier
- Full Roast Tool access
- Dashboard with AI insight
- One-time tool results (not saved)
- Academy core lessons

### Paid Tier (Pro)
- Save and sync all tool results
- Historical data and progress tracking
- Personalized AI insights over time
- Advanced Academy content
- Behavioral Index (MBI) tracking
- Priority features and future integrations

### Monetization Principle
The moment data becomes personal and persistent, it becomes paid.

Users experience value first (free).
They pay when they want to keep and grow that value.

### Implementation
- User plan stored in Supabase: `user.plan` = `free` | `pro`
- Gate: saving tool results, history, advanced AI features
- No ads. No affiliate links. No hidden incentives.
- Pricing: simple, transparent, one tier

---

## 7. DASHBOARD = DECISION ENGINE

The dashboard is NOT a summary.
It is a decision interface.

### Dashboard Structure

#### 1. Hero
Short, directional:
"Your structure is clearer. What you do next matters."

#### 2. AI Insight (Core Block)

Structure:
- What You See
- Why It Matters
- Think About
- Next Step

Tone:
- clear
- direct
- slightly confronting
- non-hyped
- never advisory

#### 3. Recommended Next Step
Only ONE primary action.
Purpose: drive behavior, reduce paralysis.

#### 4. Guided Freedom
2–3 optional actions:
- Check leakage
- Understand structure
- Improve strategy

#### 5. Academy (Light Layer)
Position: "Learn why this matters"
Supports understanding, never blocks flow.

#### 6. Tools Access
Tools are:
- accessible via navigation
- not overwhelming
- used on demand

---

## 8. AI LAYER — INTERPRETATION ENGINE

AI is NOT a gimmick.
AI is the clarity layer of MoneyMind.

### AI Core Functions
- interpret dashboard data
- explain financial structure
- highlight blind spots
- suggest next steps
- support investing and wealth building education

### AI Output Structure
- What You See
- Why It Matters
- Think About
- Next Step

### AI Tone
- neutral
- educational
- structured
- non-advisory
- never recommends specific products or investments

### AI — Investing & Wealth Support
MoneyMind uses AI to educate users on:
- the difference between saving, investing, and building wealth
- understanding risk profiles (conservative, balanced, growth)
- explaining concepts: ETFs, index funds, compound interest, diversification
- connecting user's current financial structure to investment readiness
- helping users ask better questions before speaking to an advisor

MoneyMind does NOT:
- recommend specific stocks, funds, or brokers
- give personalized investment advice
- replace a licensed financial advisor

The AI is an educational guide, not a financial advisor.

### AI Integrations (Current + Roadmap)
Current:
- Anthropic Claude (claude-sonnet-4-20250514) via `/api/ai-insight.js`

Planned:
- EUR/USD and BTC/EUR real-time rates
- Inflation data (ECB / CBS)
- Macro indicators (interest rates, market sentiment)
- Behavioral pattern recognition
- MoneyMind Behavioral Index (MBI)
- Long-term trajectory insights
- Third-party data enrichment (open banking, pension data)

### AI Expansion Principle
Every new AI integration must answer:
"Does this make the user's financial picture clearer?"
If not → don't add it.

---

## 9. ACADEMY — STRUCTURED INTELLIGENCE LAYER

The Academy is NOT a course platform.
It is a contextual financial intelligence layer.

### Academy Goals
- explain insights from the dashboard and tools
- build genuine financial understanding
- improve decision quality
- reinforce positive financial behavior
- support users on their path to financial independence

### Academy Structure (Per Lesson)
1. Concept — what is it?
2. Why it matters — real impact on your life
3. Real-world example — relatable, not textbook
4. Key insight — the one thing to remember
5. Reflection — one question to think about
6. Next step — what to do with this knowledge

### Academy Format — Video Ready
Each lesson is designed for two formats:
- **Text** (current): clean, structured, readable in 5–7 minutes
- **Video** (future): each lesson maps directly to a 3–5 minute video format

Video production principles (when ready):
- short, focused, one concept per video
- hosted on YouTube or Vimeo, embedded in Academy
- transcript available as text fallback
- no talking heads — clarity over production value

### Academy Content Tracks
1. **Foundation** — budgeting, income, expenses, savings rate
2. **Structure** — capital map, asset allocation, net worth
3. **Behavior** — financial psychology, leakage, habits
4. **Growth** — investing basics, compound interest, ETFs
5. **Independence** — financial freedom planning, passive income

### Academy Integration
Triggered from:
- Dashboard AI insights
- Tool results
- Behavioral patterns
- User-initiated exploration

### Academy Access
- Core lessons (Foundation, Behavior): free
- Advanced tracks (Growth, Independence): paid (Pro)

### Academy Positioning
Not: dominant, overwhelming, course-heavy
But: available, relevant, contextual, action-oriented

---

## 10. DATABASE — INTELLIGENCE FOUNDATION

The database is the backbone of MoneyMind.

### Purpose
- store user inputs
- track progress over time
- enable personalization
- power behavioral insights
- gate paid features

### Core Data
- Roast input
- Capital structure
- Spending vs Building allocation
- Leakage patterns
- Tool usage and results
- Timestamps and history
- User plan (free/pro)

### Use Cases
- prefill tools with existing data
- reduce friction across sessions
- show financial progress over time
- generate smarter, personalized AI insights

### Future Use
- MoneyMind Behavioral Index (MBI)
- Financial trajectory modeling
- Habit tracking and streaks
- Insight evolution over time

---

## 11. INPUT STRATEGY

Avoid:
- repeated inputs
- long forms
- friction at entry

Use:
- minimal input at start (Roast)
- progressive data enrichment over time
- reuse data everywhere
- smart defaults based on existing data

---

## 12. MOBILE & PWA STRATEGY

MoneyMind is built mobile-first.

### Approach: Progressive Web App (PWA)
- installable on Android and iOS via browser
- works without App Store submission
- offline-capable (future)
- own icon, fullscreen, no browser chrome

### Why PWA over native app (now)
- no App Store review process
- no platform fees
- same codebase as web
- fast to ship

### Native App (future consideration)
Only when:
- biometric login is required
- App Store discovery becomes strategic
- push notifications at scale are needed

---

## 13. PRODUCT EXPERIENCE GOAL

User should feel:
- "This is simple"
- "This makes sense"
- "This understands me"
- "I know what to do next"
- "This is worth paying for"

---

## 14. WHAT TO AVOID

- too many inputs
- too many choices
- feature overload
- forced flows
- financial jargon overload
- investment advice or product recommendations
- aggressive upsells

---

## 15. SUCCESS METRICS

Not:
- time spent
- clicks
- pageviews

But:
- clarity moments
- decisions made
- behavior changed
- return usage
- paid conversions (free → pro)
- Academy lessons completed

---

## 16. STRATEGIC DIFFERENTIATOR

MoneyMind is a trust platform.

- no ads
- no affiliate links
- no hidden incentives
- no investment product recommendations
- user owns their data

Users trust MoneyMind because it has no agenda.
That trust is the product's most valuable asset.

---

## 17. BUILDING RULE

Every feature must answer:

"Does this improve clarity or action?"

If not → remove it.

Every monetization decision must answer:

"Is the user getting clear value for this?"

If not → don't charge for it.

---

## FINAL STATEMENT

MoneyMind turns financial complexity into clear decisions.

It educates. It guides. It grows with the user.

That is the product.
