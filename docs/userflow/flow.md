# MoneyMind — User Flow

## Purpose

This document defines the **intended user flow** of MoneyMind.

It is the **source of truth** for:
- user journey
- screen transitions
- product logic
- flow decisions

If implementation differs from this document, this document takes priority.

---

## Core Philosophy

MoneyMind is not a tool collection.  
It is a **guided journey toward financial clarity**.

The flow must:
- feel logical
- reduce overwhelm
- guide decisions
- build understanding step by step

---

## Primary User Flow (Current Standard)

### Entry Point

## 1. Roast Tool

The Roast Tool is the **primary entry point** of MoneyMind.

Purpose:
- attract users
- create emotional engagement
- expose financial blind spots
- trigger curiosity and reflection

The Roast should:
- feel sharp but intelligent
- be honest, not insulting
- create a “this is about me” moment

---

### Transition

## 2. Roast → Dashboard

After completing the Roast Tool:

👉 The user should **immediately land on the Dashboard**

There should be:
- no splash screen
- no unnecessary intermediate steps
- no friction

---

## 3. Dashboard (Central Cockpit)

The Dashboard is the **core of the MoneyMind experience**.

It is not just a screen — it is the **decision and orientation layer**.

### Dashboard Goals

The Dashboard must:
- show where the user stands
- provide clarity
- guide next steps
- reduce confusion
- connect tools into one system

---

### Core Dashboard Blocks

#### 1. Wealth Snapshot
- overview of financial position
- simple, visual, intuitive
- not overloaded

#### 2. Financial Maintenance Status
- shows which tools are up-to-date
- indicates when updates are needed
- reinforces periodic review behavior

#### 3. AI Insight
- interprets current situation
- connects results to meaning
- provides perspective (not advice)

Structure:
- What you see
- Why it matters
- What to think about

#### 4. Next Step
- clearly suggests what the user should do next
- based on:
  - missing data
  - weak areas
  - logical progression

#### 5. Financial Clarity Ladder Progress
- shows user progression through:
  - Reality
  - Capital
  - Allocation
  - Leakage
  - Builder

---

## 4. Navigation from Dashboard

From the Dashboard, users can move into:

### Core Tools

#### Capital Map
Purpose:
- understand capital structure
- differentiate between:
  - direct capital
  - accessible capital
  - locked capital

---

#### Spending vs Building
Purpose:
- show how income is allocated
- focus on:
  - consumption vs wealth building
- not traditional budgeting

---

#### Wealth Leakage
Purpose:
- reveal inefficiencies
- highlight hidden costs
- expose structural wealth erosion

---

#### Builder / Compound Tool
Purpose:
- show long-term outcomes
- simulate growth
- make compounding tangible

---

## 5. Tool → Dashboard Loop

After using any tool:

👉 The user should return to the Dashboard

The Dashboard should:
- update insights
- update status
- update next steps
- reinforce progress

This creates a loop:

## Dashboard → Tool → Dashboard → Tool

---

## 6. AI Integration in Flow

AI is present at:
- Dashboard level
- Tool result level

AI should:
- interpret results
- connect dots
- guide thinking

AI should NOT:
- give financial advice
- prescribe actions
- act like a trading assistant

---

## 7. Academy Integration (Future Flow)

The Academy should be introduced:
- after initial tool usage
- when user curiosity is triggered

Entry points:
- from Dashboard
- from tool results
- from AI insights

---

## 8. User Progression Logic

Users move through stages:

1. Shock / Awareness (Roast)
2. Orientation (Dashboard)
3. Exploration (Tools)
4. Understanding (Insights + Academy)
5. Action (Behavior change)
6. Reinforcement (Dashboard loop)

---

## 9. Friction Rules

The flow must:

### Avoid:
- unnecessary screens
- repeated data input
- overwhelming dashboards
- complex navigation
- hidden next steps

### Ensure:
- clarity at every step
- visible next action
- minimal clicks
- logical progression

---

## 10. Legacy Elements

The following are considered **legacy and not part of the intended flow**:

- Splash screen as a primary step
- Old hub concepts not aligned with Dashboard logic
- Fragmented routing from early MVP

These may still exist in the codebase but should not define future development.

---

## 11. Core Flow Summary

### Final Simplified Flow:

**Roast Tool → Dashboard → Core Tools → Dashboard Loop**

---

## 12. Key Design Principle

MoneyMind should feel like:

> "I finally understand how my money works — and what I should look at next."

Not:
- "I am clicking through random tools"
- "I am overwhelmed"
- "I don’t know what to do"

---

## 13. Source of Truth Rule

This document defines the **intended flow**.

If:
- code
- UI
- or implementation

conflicts with this logic:

👉 This document takes priority unless explicitly updated.
