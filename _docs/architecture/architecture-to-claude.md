# MoneyMind — Architecture

## Purpose

This document defines the intended architecture of MoneyMind.

It explains:
- how the product is structured
- how core layers relate to each other
- what the current technical reality is
- what is legacy
- what direction future development should follow

If older implementation artifacts conflict with this document, this document should be treated as the architectural source of truth unless explicitly updated.

---

## High-Level Product Architecture

MoneyMind is a **financial intelligence platform** built as a layered product system.

It is not a collection of random tools.  
It is an integrated system that combines:
- awareness
- interpretation
- education
- progression
- long-term financial thinking

### Core product layers

1. **Entry Layer**
   - Roast Tool

2. **Control Layer**
   - Dashboard

3. **Core Insight Tools Layer**
   - Capital Map
   - Spending vs Building
   - Wealth Leakage
   - Builder / Compound Tool

4. **Interpretation Layer**
   - AI Insight

5. **Education Layer**
   - Academy

6. **Future Intelligence / Wealth Architecture Layer**
   - premium tools
   - advanced strategic modules
   - wealth architecture logic
   - tax-aware and structure-aware insights

---

## Core Architectural Principle

MoneyMind should be designed as a **connected system**, not a loose set of pages.

That means:
- screens should reinforce one another
- tools should connect back to the Dashboard
- insights should influence next actions
- user progress should be visible
- data should be reused where possible

The platform should feel like one coherent product.

---

## Intended User Architecture

### Primary flow

The intended main product flow is:

**Roast Tool → Dashboard → Core Tools → Dashboard Loop**

### Meaning of this structure

- **Roast Tool** = entry, hook, first diagnosis
- **Dashboard** = central cockpit and system hub
- **Core Tools** = deeper analysis layers
- **Dashboard Loop** = reinforcement, guidance, and continuity

This is the intended architecture and should override older splash-based assumptions.

---

## Layer-by-Layer Architecture

## 1. Entry Layer — Roast Tool

### Role
The Roast Tool is the primary entry point into MoneyMind.

### Purpose
- attract users
- create emotional engagement
- expose blind spots
- generate curiosity
- establish relevance quickly

### Architectural role
The Roast Tool is not just a campaign gimmick.  
It is the **front door into the platform**.

### Output
The Roast Tool should produce:
- emotional recognition
- a first diagnostic feeling
- a reason to continue into the Dashboard

### Transition rule
After Roast, users should move directly into the Dashboard.

---

## 2. Control Layer — Dashboard

### Role
The Dashboard is the central cockpit of MoneyMind.

### Purpose
- orient the user
- connect the system
- reduce overwhelm
- guide next steps
- summarize financial clarity progress

### Architectural importance
The Dashboard is the central coordinating layer between:
- tool outputs
- AI insights
- user progression
- future educational recommendations

### The Dashboard should contain
- Wealth Snapshot
- Financial Maintenance Status
- AI Insight block
- Next Step block
- Financial Clarity Ladder progress

### Key rule
The Dashboard should **guide**, not overwhelm.

It is not meant to become:
- an enterprise dashboard
- a data dump
- a collection of disconnected widgets

---

## 3. Core Insight Tools Layer

These tools are the main analytical building blocks of MoneyMind.

### A. Capital Map
Purpose:
- map capital structure
- distinguish direct, accessible, and locked capital
- create capital awareness

Architectural role:
- early-stage structural insight
- foundational input for later intelligence

### B. Spending vs Building
Purpose:
- show the balance between consumption and wealth-building
- reveal capital allocation patterns

Architectural role:
- connects cashflow to wealth logic
- supports behavior and allocation insight

### C. Wealth Leakage
Purpose:
- identify hidden wealth erosion
- show cost drag, friction, and inefficient structures

Architectural role:
- reveals why wealth progress may be weaker than expected
- connects strongly to behavior and optimization

### D. Builder / Compound Tool
Purpose:
- model long-term outcomes
- make compounding visible
- connect time and discipline to financial results

Architectural role:
- turns abstract theory into future projection
- strengthens the wealth-building logic of the platform

### Tool architecture rule
All major tools should connect back to the Dashboard.  
The product should use a **Dashboard → Tool → Dashboard** loop.

---

## 4. Interpretation Layer — AI Insight

### Role
AI is the interpretation layer of MoneyMind.

### Purpose
- explain results
- create perspective
- connect outputs to deeper meaning
- improve user understanding

### AI should not be treated as
- a financial advisor
- a trading signal system
- a recommendation engine for personal investments
- a pseudo-expert that fakes certainty

### Preferred AI structure
Each AI insight should follow:

1. What you see  
2. Why it matters  
3. What to think about  

### Architectural role
AI sits between:
- raw output
- user understanding
- future educational flow

AI should increase clarity, not noise.

---

## 5. Education Layer — Academy

### Role
The Academy is the learning system of MoneyMind.

### Purpose
- teach financial concepts
- explain the logic behind wealth-building
- support users after tools reveal curiosity or confusion
- reinforce long-term retention

### Architectural role
The Academy should not float separately from the tools.

It should be linked through:
- tool results
- AI insights
- Dashboard suggestions
- progression logic

### Principle
Tool → Insight → Lesson

That connection is part of the intended architecture.

---

## 6. Future Intelligence / Wealth Architecture Layer

### Role
This is the longer-term advanced layer of MoneyMind.

### Future scope
- advanced capital allocation
- income structures
- real estate logic
- wealth architecture
- fiscal awareness
- capital deployment frameworks
- protection / preservation concepts

### Architectural role
This layer should build on top of:
- existing tools
- existing user profile
- prior insights
- academy understanding

This layer should not be rushed into the MVP.

---

## Information Architecture

MoneyMind’s information architecture should follow this logic:

### From emotional relevance
Roast Tool

### To orientation
Dashboard

### To structural understanding
Core tools

### To interpreted meaning
AI Insight

### To deeper learning
Academy

### To advanced optimization
Future wealth architecture layer

This sequence matters.  
It prevents the product from feeling random or overwhelming.

---

## Data Architecture Principles

MoneyMind should eventually move toward a connected data model.

### Core rule
Users should not repeatedly enter the same data.

### Data should be reused across tools where possible

Examples:
- profile/onboarding data
- capital data
- income data
- expense allocation data
- prior tool results
- last-updated timestamps

### Long-term data concepts
The system will likely need persistence for:
- user profile
- tool results
- progress state
- maintenance/update timestamps
- AI interpretation history
- academy progress
- future behavioral metrics

---

## Current Technical Stack

### Current tools / infrastructure
- **GitHub** for source control and repository management
- **Vercel** for deployment / hosting
- **Supabase** planned for backend, persistence, and auth

### Current frontend reality
- lightweight HTML / CSS / JavaScript
- MVP-stage implementation
- some earlier work originated in CodePen
- currently in a transition phase toward stronger architecture

---

## Technical Architecture Direction

### Current state
The project contains:
- working tool logic
- prototype-era structure
- some mixed routing assumptions
- partial app logic
- reusable components in concept, not always yet in formal structure

### Intended technical direction
Move toward a cleaner architecture with:
- clearer file structure
- reusable shared UI patterns
- reusable data logic
- predictable routing
- cleaner state handling
- future backend connection through Supabase

---

## Routing Architecture

### Current intended routing logic
The product should follow:

- Roast Tool
- Dashboard
- Core tools accessible from Dashboard
- return path back to Dashboard
- future Academy and deeper layers connected from both Dashboard and results

### Routing principle
Routing should reinforce product logic.

It should not feel like:
- random page jumps
- temporary prototype links
- scattered navigation

### Legacy note
Earlier splash-based routing assumptions are no longer part of the intended main architecture.

---

## Component / Screen Architecture Principles

The interface should evolve toward reusable screen logic.

### Reusable structural patterns may include:
- screen shell / layout wrapper
- header pattern
- progress / ladder pattern
- AI insight block
- next step block
- summary card patterns
- result section templates
- input section templates

### Goal
Reduce inconsistency across tools and create a coherent system feel.

---

## Product State vs Legacy vs Future

This distinction is critical.

### Intended architecture
This is the target structure:
- Roast Tool as entry point
- Dashboard as central cockpit
- tool loop around Dashboard
- AI as interpretation layer
- Academy integrated into flow

### Current implementation
This is the present reality:
- multiple tools already exist
- some tools work well
- some UX and structure still reflect MVP experimentation
- architecture is partially coherent but not fully unified yet

### Legacy artifacts
These may still exist but should not define future development:
- splash-first assumptions
- older hub logic not aligned with the new dashboard role
- fragmented prototype routing
- CodePen-era shortcuts that weaken product coherence

### Future architecture
This includes:
- persistence
- account logic
- richer Dashboard intelligence
- Academy integration
- stronger AI layer
- Supabase-backed data flow
- more scalable product structure

---

## Product Rules That Affect Architecture

The following rules are strategic and architectural, not cosmetic:

1. **Minimize repeated input**
2. **Reuse data where possible**
3. **Dashboard is the cockpit**
4. **AI interprets, not advises**
5. **Mobile-first is mandatory**
6. **Simplicity is strategic**
7. **Product logic matters more than visual complexity**
8. **Behavioral finance should be integrated, not bolted on later**

---

## Architecture Constraints

When evolving the system, preserve the following constraints:

- do not turn the Dashboard into a cluttered control panel
- do not build disconnected tools with no system relationship
- do not add features that weaken clarity
- do not rely on AI as a substitute for good product structure
- do not let legacy implementation define future UX decisions
- do not overcomplicate the MVP with premature backend complexity

---

## Recommended Documentation Relationship

This file should work together with:

- `docs/product-vision.md`
- `docs/user-flow.md`
- `docs/current-state.md`
- `docs/roadmap.md`

### Intended use
- `product-vision.md` explains why the product exists
- `user-flow.md` explains how users move through it
- `architecture.md` explains how the system is structured
- `current-state.md` explains where the build stands right now
- `roadmap.md` explains what comes next

---

## Source of Truth Rule

If code or implementation artifacts conflict with this document, this document should be prioritized unless the architecture has intentionally changed and this file has not yet been updated.

---

## Final Architecture Summary

MoneyMind should be built as:

- a connected financial intelligence system
- with Roast as the entry point
- Dashboard as the central cockpit
- tools as structured insight engines
- AI as interpretation layer
- Academy as learning reinforcement
- future wealth architecture as advanced expansion

The architecture should create one feeling:

> “This product understands where I am, helps me see clearly, and shows me what matters next.”
